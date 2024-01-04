import { Button, Input } from "antd"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { useState } from "react"



export const AccountCreation = () => {

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [confirmPass, setConfirmPass] = useState<string>('')

    const auth = getAuth()

    const submitUser = async () => {
        try{
            await createUserWithEmailAndPassword(auth, email, pass)
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
            <Input
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm Password"
            />
            <Button
                onClick={submitUser}
            >
                Create Account
            </Button>
        </div>
    )
}