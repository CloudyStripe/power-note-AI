import { Button, Input } from "antd"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './signOn.scss'

export const SignOn = () => {

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')

    const navigate = useNavigate()
    const auth = getAuth()

    const navigateToCreation = () => {
        navigate('/createAccount')
    }

    const authenticate = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, pass)
            navigate('/')
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="authContainer">
            <img className="logo" src="../../images/logo_dark.png"/>
            <h1>Sign in to Power Note</h1>
            <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <Input
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
            />
            <div className="buttonContainer">
                <Button
                    size="large"
                    onClick={authenticate}
                >
                    Sign-In
                </Button>
                <div className="divider">
                    <p>Or</p>
                </div>
                <Button
                    size="large"
                    onClick={navigateToCreation}
                >
                    Create Account
                </Button>
            </div>
            <p className="forgotPass">Forgot your password?</p>
        </div>
    )
}