const transporter = require('../helpers/nodemailer')

const registroUsuario = async(nombre, apellido, emailUsuario) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Bienvenido a nuestra página!!!👻 <${process.env.GMAIL_USER}>`, // sender address
    to: emailUsuario, // list of receivers (email pasado como argumento)
    subject: "Bienvenido ✔", // Subject line
    html: `
     <div>
    <div style="width: 100%; height: 200px; overflow: hidden;">
        <img src="https://images.pexels.com/photos/3643925/pexels-photo-3643925.jpeg" alt="Bienvenida" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
    </div>

    <div style="text-align: center; margin-top: 20px;">
        <h1 style="font-size: 2.5em;">¡Bienvenido a nuestra plataforma!</h1>
        <p style="font-size: 1.5em;">Nos alegra que formes parte de nuestra comunidad. Disfruta de una experiencia única.</p>
    </div>
    
    <div style="width: 100%; height: 150px; overflow: hidden; margin-top: 20px;">
        <img src="https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg" alt="Usuario" style="width: 100%; height: 100%; object-fit: cover; object-position: bottom;">
    </div>
</div>




    `, // html body
  });

  return info; // Retorna info si es necesario para manejar la respuesta
};

const pagoProductosUsuario = async(emailUsuario) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Pago exitoso!!!👻" <${process.env.GMAIL_USER}>`, // sender address
    to: emailUsuario, // list of receivers
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
      to: email,
      subject: 'Recupera tu contraseña',
      html: `
        <div>
    <div style="width: 100%; height: 200px; overflow: hidden;">
        <img src="https://images.pexels.com/photos/2882630/pexels-photo-2882630.jpeg" alt="Bienvenida" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
    </div>

    <div style="text-align: center; margin-top: 20px;">
        <h1 style="font-size: 2.5em;">Restablece tu contraseña</h1>
        <p>Utiliza el siguiente token para restablecer tu contraseña:</p>
        <p><strong style="font-size: 1.8em;">${token}</strong></p>
        <br>
        <p>Si prefieres, también puedes hacer clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="http://localhost:3000/reset-password/${token}" style="font-size: 1.2em; color: #007bff;">Restablecer Contraseña</a>
    </div>
    
    <div style="width: 100%; height: 150px; overflow: hidden; margin-top: 20px;">
        <img src="https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg" alt="Usuario" style="width: 100%; height: 100%; object-fit: cover; object-position: bottom;">
    </div>
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
