const API = {
  BASE_URL: "http://localhost:8080/api/email",

  async generateReply(emailContent, tone, length) {
    const response = await fetch(`${this.BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailContent,
        tone,
        length,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.text();
  },
};