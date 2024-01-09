import { Button, Input } from "antd"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { useState } from "react"
import './accountCreation.scss'
import { useNavigate } from "react-router-dom"

export const AccountCreation = () => {

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setConfirmPass] = useState<string>('')

    const auth = getAuth()
    const navigate = useNavigate()

    const submitUser = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass)
            navigate('/')
        }
        catch (e) {
            console.log(e)
        }
    }

    const navigateToSignUp = () => {
        navigate('/signOn')
    }

    return (
        <div className="authContainer">
            <img className="logo" src="../../images/logo_dark.png" />
            <h1>Create Account</h1>
            <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <Input
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
            />
            <Input
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm Password"
            />
            <div className="buttonContainer">
                <Button
                    size="large"
                    onClick={submitUser}
                >
                    Sign Up
                </Button>
                <div className="divider">
                    <p>Or</p>
                </div>
                <Button
                    size="large"
                    onClick={navigateToSignUp}
                >
                    Sign In
                </Button>
            </div>
        </div>
    )
}