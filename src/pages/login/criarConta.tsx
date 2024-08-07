import { styled } from "@stitches/react";
import { useForm } from "react-hook-form";
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CriarConta() {

    const mySchema = zod.object({
        username: zod.string().min(3, 'O nome de usuário deve ter no mínimo 3 caracteres'),
        email: zod.string().email('Informe um email válido'),
        password: zod.string().min(8, 'A senha deve ter no mínimo 8 dígitos').max(10, 'A senha deve ter no máximo 10 dígitos')
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(mySchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    const [backMessage, setBackMessage] = useState('');
    const router = useRouter();

    async function botaoApertado(data: any) {
        console.log(data);

        try {
            const response = await fetch('https://decasametais.com/auth/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password
                })
            });
            

            if (response.ok) {
                setBackMessage('Usuário criado com sucesso');

                setTimeout(() => {
                    router.push('/login');
                }, 3000)

            } else if (response.status == 409) {
                setBackMessage('Nome de usuário, ou, Email já cadastrado.')
                
            } else {
                console.log('Erro ao criar usuário:', response.status);
                console.log(response);
                setBackMessage('Usuário não foi criado');
            }
            
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            setBackMessage('Houve um erro na requisição')
        }
        
        reset();
    } 

    return (
        <LoginContainer>
            <Form onSubmit={handleSubmit(botaoApertado)}>
                <h1>Crie uma <strong>conta</strong></h1>
                <span>inserindo seu nome, email e senha</span>

                <LabelContainer>
                    <input 
                        type="text" 
                        placeholder="Nome Usuario"
                        {...register('username')}
                    />
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                </LabelContainer>

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
                    <MyButton variant="criarConta" type="submit">Criar conta</MyButton>
                    
                    <Link href='/login'>
                        <MyButton variant="login">Log in</MyButton>
                    </Link>       
                </ButtonsContainer>

                {backMessage && <h2>{backMessage}</h2>} 
            </Form>
        </LoginContainer>
    )
}

const LoginContainer = styled('div', {
    width: '100vw',
    height: '100%',
    display: 'flex',
    background: 'linear-gradient(107deg, rgba(26,178,243,1) 0%, rgba(29,169,230,1) 51%, rgba(97,180,214,1) 90%, rgba(41,151,196,1) 100%)',

    '@media(max-width: 720px)': {
        height: '100vh'
    },
})

const Form = styled('form', {
    background: '$white',
    marginLeft: '3rem',
    padding: '6rem 3.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',

    '@media(max-width: 720px)': {
        padding: '4.5rem 1.8rem 0rem 2rem',
        maxHeight: '100%', 
        overflowY: 'auto',
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
    marginTop: '1.8rem',
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
            },
            
            login: {
                color: '$white',
                background: '$blue',
                padding: '1.1rem 1.2rem',
                width: '10rem',
                border: 'none',
                borderRadius: '0 10px 10px 0',
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