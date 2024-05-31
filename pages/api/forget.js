import Forgot from "../../models/forget"
import User from "../../models/User";

export default async function handler(req, res) {
    if (req.body.sendEmail) {
        let token = `defeifs798793453jslhflsjfsdlkfsfsfs79357`
        let forgot = new Forgot({
            email: req.body.email,
            token: token
        })
        let email = `We have sent you this email in response to your request to reset your password on Codeswear.com 
    To reset your password,Please follow the link below:
    <a href="https://codeswear.com/forgot?token=${token}">Click here to reset your password</a>
    <br/><br/>
    We recommend that you keep your password secure and share it with anyone.If you feel your password has been compromised,you can change it by going to your Account Page and Change your password.
    <br/><br/>`
    } else {

    }
    res.status(200).json({ success: true })
}