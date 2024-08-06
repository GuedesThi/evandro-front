import { styled } from "@stitches/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Account() {
    const [user, setUser] = useState<any>({});
    const [edicaoAtivada, setEdicaoAtivada] = useState<boolean>(false);
    const [atualEmail, setAtualEmail] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');
    const [newAddress, setNewAddress] = useState<string | null>(null);
    const [newCep, setNewCep] = useState<string | null>(null);
    const [informacao, setInformacao] = useState<string>('');
    const [dataSaved, setDataSaved] = useState<boolean>(false);
    const router = useRouter();

    async function initialRequest(token: string) {

        console.log('Token sendo enviado:', token);
        // 91.108.125.131
        try {
            const response = await fetch('http://91.108.125.131:8080/auth/account', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('Dado recebido inicialmente', userData);

                setUser(userData);
                setNewName(user.name);
                setAtualEmail(user.email);
                setNewAddress(user.address);
                setNewCep(user.cep);
            
            } else if (response.status === 403) {
                router.replace('/login');

            }

        } catch (error) {
            console.error('Erro na requisição:', error);
        }

    };

    async function sendNewData(token: string) {

        const dataToSend: any = {
            username: newName,
            atualEmail: atualEmail,
            address: newAddress,
            cep: newCep
        };
    
        if (newEmail) {
            dataToSend.email = newEmail;
        }

        console.log('Dados enviados:', dataToSend);

        try {
            const response = await fetch('http://91.108.125.131:8080/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const userData = await response.json(); 
                console.log('Dados recebidos:', userData);
                localStorage.setItem('token', userData.token);
                setUser(userData);
                setDataSaved(false);

            } else {
                console.error('Erro ao atualizar dados:', response.statusText);
            }
        } catch (error) {
            console.error('Erro na hora de enviar os dados:', error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token == null || token == undefined) {
            router.replace('/login');

        } else {
            initialRequest(token);
        }
    }, []);

    useEffect(() => {
        setNewName(user.name);
        setAtualEmail(user.email);
        setNewAddress(user.address);
        setNewCep(user.cep);
    }, [user]);

    useEffect(() => {
        if (dataSaved) {
            const token = localStorage.getItem('token');
            if (token == null || token == undefined) {
                router.replace('/login');
            } else {
                sendNewData(token);
            }
        }
    }, [dataSaved]);    

    function handleMudarInformacao(informacao: string) {
        setInformacao(informacao);
    };

    function handleBotaoEditar() {
        if (edicaoAtivada) {
            setEdicaoAtivada(false);
        } else {
            setEdicaoAtivada(true);
            setNewName(user.name);
        }
    };

    function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === 'inputNome') {
            setNewName(value);
        } else if (name === 'inputEmail') {
            setNewEmail(value);
        } else if (name === 'inputAddress') {
            setNewAddress(value);
        } else if (name === 'inputCep') {
            setNewCep(value);
        }
    };

    function saveNewData() {
        setUser((userAtual: any) => (
            {...userAtual, name: newName, email: newEmail, address: newAddress, cep: newCep}
        ));
        setEdicaoAtivada(false);
        setDataSaved(true);
    }

    return (
        <AccountContainer>
            <BackgroundContainer>
                <Link href="/">
                    <Image src='/assets/default/home.png' alt='home-icone' width={18} height={18} />
                </Link>
            </BackgroundContainer>

            <ContentContainer>
                <BasicInfosContainer>
                    <img alt="user-image" src={user.urlImage} width={140} height={140} />
                    
                    <div>
                        <div>
                           <h2>{user.name}</h2>
                           <Image onClick={handleBotaoEditar} src='/assets/default/edit.png' alt='logo-editar' width={18} height={18}/>
                        </div>
                        
                        <p>{user.email}</p>
                    </div>
                </BasicInfosContainer>

                <InformationsContainer>
                    <div>
                        <ButtonsContainer>
                            <button onClick={() => handleMudarInformacao('perfil')}>Perfil</button>
                            <button onClick={() => handleMudarInformacao('pedidos')}>Pedidos</button>
                            <button onClick={() => handleMudarInformacao('pagamentos')}>Pagamento</button>
                        </ButtonsContainer>
                        <Line></Line>
                    </div>
                    
                    {informacao === 'perfil' && <PerfilComponent edicaoAtivada={edicaoAtivada} user={user} atualEmail={atualEmail} newName={newName} newEmail={newEmail} newAddress={newAddress} newCep={newCep} saveNewData={saveNewData} changeInput={changeInput} />}
                    {informacao === 'pedidos' && <PedidosComponent/>}
                    {informacao === 'pagamentos' && <PagamentosComponent/>}
                </InformationsContainer>
            </ContentContainer>

        </AccountContainer>
    )
};

const PerfilComponent = ({edicaoAtivada, user, atualEmail, newName, newEmail, newAddress, newCep, saveNewData, changeInput}: {edicaoAtivada: boolean, user: any, atualEmail: string, newName: string, newEmail: string, newAddress: string | null, newCep: string | null, saveNewData: any, changeInput: any}) => (
    <PerfilContainer>
        <Info>
            <h3>Nome usuário</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputNome" onChange={changeInput} value={newName} />
            ) : (
                <h4>{user.name}</h4>
            )}
        </Info>

        <InfoEmail>
            <h3>Email</h3>
            {edicaoAtivada ? (
                <InputActivate>
                    <input type="text" name="inputEmailAtual" value={atualEmail} disabled/>
                    <input type="text" name="inputEmail" onChange={changeInput} placeholder="Novo email..." />
                </InputActivate>
            ) : (
                <h4>{user.email}</h4>
            )}
        </InfoEmail>

        <Info>
            <h3>Endereço</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputAddress" onChange={changeInput} value={newAddress || ''} />
            ) : (
                <h4>{user.address || 'Valor não informado'}</h4>
            )}
        </Info>

        <Info>
            <h3>CEP</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputCep" onChange={changeInput} value={newCep || ''} />
            ) : (
                <h4>{user.cep || 'Valor não informado'}</h4>
            )}
        </Info>

        {edicaoAtivada ? (
            <button onClick={saveNewData}>Salvar</button>
        ) : null}
    </PerfilContainer>
);

const PedidosComponent = () => (
    <div>
        Informações dos Pedidos
    </div>
);

const PagamentosComponent = () => (
    <div>
        Informações dos Pagamentos
    </div>
);

const AccountContainer = styled('div', {
    width: '100vw',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',

    'button': {
        width: '3.8rem',
        height: '2rem',
        cursor: 'pointer'
    }
});

const BackgroundContainer = styled('div', {
    width: '100vw',
    height: '18rem',
    background: '$grayMain',

    'a': {
        'img': {
            margin: '1rem'
        }
    }
});

const ContentContainer = styled('div', {
    width: '100vw',
    height: 'auto',
});

const BasicInfosContainer = styled('div', {
    width: '60rem',
    marginLeft: '3rem',
    display: 'flex',

    'img': {
        borderRadius: '70px',
        top: '-4rem',
        position: 'relative'
    },

    'div': {
        marginLeft: '1.2rem',
        
        'p': {
            color: '$grayLight'
        },

        'div': {
            gap: '1rem',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 0 0.3rem -0rem',

            'h2': {
                color: '$grayMain',
                fontSize: '1.4rem'
            },

            'img': {
                borderRadius: '0',
                top: '0',
                cursor: 'pointer'
            }
        }
    }
});

// BOTÕES + LINHA + INFORMAÇÕES
const InformationsContainer = styled('div', {
    marginLeft: '3rem',
    marginBottom: '7rem'
})

const Line = styled('div', {
    background: '$blue',
    width: '90%',
    height: '0.4rem',
    borderRadius: '100px'
})

const ButtonsContainer = styled('div', {
    display: 'flex',
    gap: '2.8rem',
    marginLeft: '0.5rem',
    paddingBottom: '0.5rem',

    'button': {
        border: 'none',
        fontSize: '1.1rem',
        cursor: 'pointer',

        '&:hover': {
            color: '$blue'
        },

        '&:focus': {
            color: '$blue'
        }
    },


});

const PerfilContainer = styled('div', {
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.2rem'
});

const Info = styled('div', {
    width: '42rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    'h3': {
        fontSize: '1rem'
    },

    'h4': {
        fontWeight: '100'
    },

    'input': {
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid $grayLight',
        fontSize: '1rem',
        width: '20rem',
        fontFamily: '$text'
    }
});

const InfoEmail = styled('div', {
    width: '42rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    'h3': {
        fontSize: '1rem'
    },

    'h4': {
        fontWeight: '100'
    },
});

const InputActivate = styled('div', {
    marginLeft: '19.4rem',
    display: 'flex',
    gap: '2rem',

    'input': {
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid $grayLight',
        fontSize: '1rem',
        width: '20rem',
        fontFamily: '$text'
    },
})