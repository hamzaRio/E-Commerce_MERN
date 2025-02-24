import  Typography  from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import {  useNavigate } from "react-router-dom";

const LoginPage = () => { 
        const [error, setError] = useState("");
        const emailRef = useRef<HTMLInputElement>(null);
        const passwordRef = useRef<HTMLInputElement>(null);

        const { login } = useAuth(); 
        const navigate = useNavigate();
            
    
        const onSubmit = async () => {
            

            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;
            
            // Add your own validation logic here
            if ( !email || !password) {
                alert("All fields are required");
                return;
            }
            // Add your own API call here   
            // Example: axios.post("/api/register", { name, email, password });
            console.log(email , password);

            const response = await fetch(`${BASE_URL}/user/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            if (!response.ok) {
                setError("An error occurred while login");
                return;
            }
            const token = await response.json();
            

            if(!token)
            {
                setError("An error occurred while login");
                return;
            }


            login(email, token);



           
            alert("login successful!");
           // Reset form fields

           navigate("/");

            //emailRef.current!.value = "";
           // passwordRef.current!.value = "";

           // console.log(token);

            
         };  


    return (
        <Container>
            <Box sx={{ display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column',
                mt: 4,}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Login  Account 
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
               
                <TextField inputRef={emailRef} label="Email" name="email" />
                <TextField inputRef={passwordRef} type="password" label="Password" name="password" />
                <Button onClick={onSubmit} variant="contained">Login</Button>
                {error && <Typography sx={{color:"red"}}>{error}</Typography>}
            </Box>
            </Box>
        </Container>
    );   
}

export default LoginPage;