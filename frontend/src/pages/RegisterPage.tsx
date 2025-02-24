import  Typography  from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";

const RegisterPage = () => { 
        const [error, setError] = useState("");
        const firstnameRef = useRef<HTMLInputElement>(null);
        const lastnameRef = useRef<HTMLInputElement>(null);
        const emailRef = useRef<HTMLInputElement>(null);
        const passwordRef = useRef<HTMLInputElement>(null);

        const { login } = useAuth(); 
            
    
        const onSubmit = async () => {
            
            const firstname = firstnameRef.current?.value;
            const lastname = lastnameRef.current?.value;
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;
            
            // Add your own validation logic here
            if (!firstname || !lastname || !email || !password) {
                alert("All fields are required");
                return;
            }
            // Add your own API call here   
            // Example: axios.post("/api/register", { name, email, password });
            console.log(firstname,lastname, email , password);

            const response = await fetch(`${BASE_URL}/user/register`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                }),
            });
            if (!response.ok) {
                setError("An error occurred while registering");
                return;
            }
            const token = await response.json();
            

            if(!token)
            {
                setError("An error occurred while registering");
                return;
            }


            login(email, token);


           
            alert("Registration successful!");
           // Reset form fields
            firstnameRef.current!.value = "";
            lastnameRef.current!.value = "";
            emailRef.current!.value = "";
            passwordRef.current!.value = "";

            console.log(token);
         };  


    return (
        <Container>
            <Box sx={{ display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column',
                mt: 4,}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Register New Account 
            </Typography>
            <Box sx={{display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                boxShadow: 1,
                width: "50%",
                gap: 2,
            }}>
                <TextField inputRef= {firstnameRef} label="First name" name="firstame" />
                <TextField inputRef= {lastnameRef} label="Last name" name="lastname" />
                <TextField inputRef={emailRef} label="Email" name="email" />
                <TextField inputRef={passwordRef} type="password" label="Password" name="password" />
                <Button onClick={onSubmit} variant="contained">Register</Button>
                {error && <Typography sx={{color:"red"}}>{error}</Typography>}
            </Box>
            </Box>
        </Container>
    );   
}

export default RegisterPage;