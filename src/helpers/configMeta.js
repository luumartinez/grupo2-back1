const configHeaderWhatsApp = (token, mensaje) => {
    return {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mensaje),
    };
  };

  module.exports = configHeaderWhatsApp 
