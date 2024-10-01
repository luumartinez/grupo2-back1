const transporter = require('../helpers/nodemailer')

const registroUsuario = async(nombre, apellido, emailUsuario) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Bienvenido a nuestra pagina!!!👻" <${process.env.GMAIL_USER}>`, // sender address
    to: `rafaelortega1911@gmail.com`, // list of receivers
    subject: "Bienvenido ✔", // Subject line
    html: `
     <div>
        <div style='display: flex; justify-content: center;'>
            <img src="https://images.vexels.com/content/234933/preview/bienvenida-badge-banner-8aaee8.png" alt="">
        </div>
        
        <div>
            <img src="https://www.shutterstock.com/image-photo/young-smiling-male-businessman-founder-600nw-2454061349.jpg" alt="" width="100%">
        </div>
    </div>
    `, // html body
  });
}

const pagoProductosUsuario = async() => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Pago exitoso!!!👻" <${process.env.GMAIL_USER}>`, // sender address
    to: `rafaelortega1911@gmail.com`, // list of receivers
    subject: "Gracias por tu compra ✔", // Subject line
    html: `
     <div>
        <div style='display: flex; justify-content: center;'>
            <img src="https://images.vexels.com/content/234933/preview/bienvenida-badge-banner-8aaee8.png" alt="">
        </div>
        
        <div>
            <img src="https://www.shutterstock.com/image-photo/young-smiling-male-businessman-founder-600nw-2454061349.jpg" alt="" width="100%">
        </div>
    </div>
    `, // html body
  });
}

const recuperoContraseniaUsuario = async (token, email) => {
  try {
    // Enviar el correo de recuperación con el token incluido
    const info = await transporter.sendMail({
      from: `"Recuperación de Contraseña" <${process.env.GMAIL_USER}>`,
      to: `rafaelortega1911@gmail.com`,
      subject: 'Recupera tu contraseña',
      html: `
        <div>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="http://localhost:3000/reset-password/${token}">Restablecer Contraseña</a>
          <br>
          <p>Para realizar pruebas, este es tu token:</p>
          <p><strong>${token}</strong></p>
        </div>
      `,
    });

    return { message: 'Correo de recuperación enviado', info };
  } catch (error) {
    throw new Error('Error al enviar el correo de recuperación');
  }
};

module.exports = {
  registroUsuario,
  pagoProductosUsuario,
  recuperoContraseniaUsuario
}
