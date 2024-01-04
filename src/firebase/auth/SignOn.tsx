import { Button, Input } from "antd"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const SignOn = () => {

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')

    const navigate = useNavigate()
    const auth = getAuth()

    const navigateToClient = () => {
        navigate('/createAccount')
    }

    const authenticate = async () => {
        try{
            await signInWithEmailAndPassword(auth, email, pass)
            navigate('/')
        }
        catch(e){
            console.log(e)
        }
    }

    return (
        <div>
            <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <Input
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
            />
            <Button
                onClick={authenticate}
            >
                Sign-In
            </Button>
            <Button
                onClick={navigateToClient}
            >
                Create Account
            </Button>
        </div>
    )
}