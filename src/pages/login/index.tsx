import { styled } from "@stitches/react";
import { useForm } from "react-hook-form";
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const [backMessage, setBackMessage] = useState('');
    const router = useRouter();

    const mySchema = zod.object({
        email: zod.string().email('Informe um email válido'),
        password: zod.string().min(8, 'A senha deve ter no mínimo 8 dígitos').max(10, 'A senha deve ter no máximo 10 dígitos')
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(mySchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    async function botaoApertado(data: any) {
        try {
            const response = await fetch('https://decasametais.com/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            let message;

            if (response.ok) {
                const data_back = await response.json();
                message = data_back.situation === 'yes' ? 'Usuário autenticado com sucesso' : 'Email ou Senha inválido';
                setBackMessage(message);
            
                const { token } = data_back;
                localStorage.setItem('token', token);
                console.log(localStorage.getItem('token'));

                setTimeout(() => {
                    router.push('/');
                }, 3000)

            } else {
                const errorData = await response.json();
                message = errorData.situation === 'no' ? 'Email ou Senha inválido' : 'Erro desconhecido';
            }
    
            console.log(message);
            
        } catch (error) {
            console.error('Houve um erro na requisição: ' + error);
        }
        
        reset();
    }
    

    return (
        <LoginContainer>
            <Form onSubmit={handleSubmit(botaoApertado)}>
                <h1>Faça <strong>login</strong> em sua conta</h1>
                <span>utilizando seu email e senha</span>

                <LabelContainer>
                    <input 
                        type="email" 
                        placeholder="seuemail@gmail.com"
                        {...register('email')}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </LabelContainer>

                <LabelContainer>
                    <input 
                        type="password" 
                        placeholder="12345678"
                        {...register('password')}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </LabelContainer>

                <ButtonsContainer>
                    <MyButton variant="login" type="submit">Log in</MyButton>
                    
                    <Link href='/login/criarConta'>
                        <MyButton variant="criarConta">Criar conta</MyButton>
                    </Link>
                </ButtonsContainer>

                {backMessage && <h2>{backMessage}</h2>}
            </Form>
        </LoginContainer>
    )
}

const LoginContainer = styled('div', {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    background: 'linear-gradient(107deg, rgba(26,178,243,1) 0%, rgba(29,169,230,1) 51%, rgba(97,180,214,1) 90%, rgba(41,151,196,1) 100%)'
})

const Form = styled('form', {
    background: '$white',
    marginLeft: '3rem',
    padding: '6rem 3.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',

    '@media(max-width: 720px)': {
        padding: '7rem 1.8rem 0rem 2rem',
        gap: '0.8rem',
        marginLeft: '1.8rem',
        width: '22.5rem'
    },

    'h1': {
        fontFamily: '$text',
        color: '$grayMain',
        fontWeight: '500',
        fontSize: '2rem',

        '@media(max-width: 720px)': {
            fontSize: '1.3rem'
        },
    },

    'span': {
        color: '$grayLight',
        fontSize: '1.1rem',

        '@media(max-width: 720px)': {
            fontSize: '0.9rem',
            marginBottom: '1rem',
        },
    }
})

const LabelContainer = styled('div', {
    marginTop: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    width: '27rem',

    '@media(max-width: 720px)': {
        marginTop: '1.5rem',
        width: '17rem'
    },

    'input': {
        padding: '1.2rem 1.5rem',
        borderRadius: '20px',
        border: '2px solid $grayLight',
        background: 'transparent',
        color: '$grayMain',
        fontSize: '1rem',
        fontFamily: '$text',

        '@media(max-width: 720px)': {
            padding: '0.9rem 1.1rem',
            fontSize: '0.9rem',
            borderRadius: '16px'
        },

        '&:hover': {
            border: '2px solid $blue'
        },

        '&:focus': {
            border: '2px solid $blue'
        }

    },
})

const ButtonsContainer = styled('div', {
    display: 'flex',
    width: 'auto',
    marginTop: '2.5rem',
})

const MyButton = styled('button', {
    variants: {
        variant: {
            login: {
                color: '$white',
                background: '$blue',
                padding: '1.1rem 1.2rem',
                width: '10rem',
                border: 'none',
                borderRadius: '10px 0 0 10px',
                fontWeight: '400',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.4s ease-in-out',

                '@media(max-width: 720px)': {
                    padding: '1.3rem 2.3rem',
                    fontSize: '1.2rem',
                    width: 'auto'
                },

                '&:hover': {
                    transform: 'scale(1.1)',
                }
            },

            criarConta: {
                color: '$black',
                background: '$white',
                padding: '1.1rem 1.2rem',
                width: '10rem',
                border: 'none',
                fontWeight: '400',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.4s ease-in-out',

                '@media(max-width: 720px)': {
                    padding: '1.3rem',
                    fontSize: '1.2rem',
                    width: 'auto'
                },

                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }
        }
    }
})

const ErrorMessage = styled('p', {
    marginTop: '1.5rem',
    color: 'red',

    '@media(max-width: 720px)': {
        fontSize: '0.8rem',
        marginTop: '1rem'
    },    
})