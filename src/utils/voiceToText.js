export const voiceToText = async (filePath) => {
  try {
    const apiKey = process.env.SPEECH_TO_TEXT_API_KEY;
    // 1. Upload the audio to AssemblyAI
    const uploadResponse = await axios({
      method: "post",
      url: "https://api.assemblyai.com/v2/upload",
      headers: {
        authorization: apiKey,
        "Transfer-Encoding": "chunked", // required
      },
      data: fs.createReadStream(filePath),
    });

    const audioUrl = uploadResponse.data.upload_url;

    // 2. Send for transcription
    const response = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        speech_model: "universal",
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response)
    const transcriptId = response.data.id;
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    // 3. Poll until complete
    while (true) {
      const pollingRes = await axios.get(pollingEndpoint, {
        headers: { authorization: apiKey },
      });

      if (pollingRes.data.status === "completed") {
        fs.unlinkSync(filePath); // delete temp file
        return reply.code(200).send({ transcription: pollingRes.data.text });
      } else if (pollingRes.data.status === "error") {
        throw new Error("Transcription failed: " + pollingRes.data.error);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3s
      }
    }
  } catch (err) {
    fastify.log.error("Transcription error:", err);
    return reply.code(500).send({ error: "Failed to transcribe audio." });
  }
};