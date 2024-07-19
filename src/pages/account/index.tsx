import { styled } from "@stitches/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Account() {
    const [tokenExpirado, setTokenExpirado] = useState<boolean>(false);
    const [user, setUser] = useState<any>({});
    const [informacao, setInformacao] = useState<string>('perfil');
    const [editMode, setEditMode] = useState<boolean>(false);
    const router = useRouter();

    async function requestUserData(token: string) {
        
        try {
            const response = await fetch('http://10.0.0.103:8080/auth/account', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return true;

            } else if (response.status == 403) {
                setTokenExpirado(true);

            } else {
                console.error('Erro ao obter informações do usuário:', response.statusText);
                return false;
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            return false;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token == null || token == undefined) {
            router.replace('/login');

        } else {
            requestUserData(token).then((sucess) => {
                if (sucess) {
                    console.log('TUDO CERTO');
                }
            });
        }

    }, []);

    useEffect(() => {
        if (tokenExpirado) {
            router.replace('/login');
        }
    }, [tokenExpirado]);

    function mudarInformacao(informacao: string) {
        setInformacao(informacao);
    };

    function editarDado() {
        setEditMode(true);
    };

    async function salvarDado() {
        const token = localStorage.getItem('token');

        if (token == null || token == undefined) {
            router.replace('/login');
        }

        try {
            const response = await fetch('http://10.0.0.103:8080/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                const newUserData = await response.json();
                setUser(newUserData);
                setEditMode(false);
                console.log('Dado atualizado no Banco de Dados')
            } else {
                console.error('Houve um erro:', response.statusText);
                setEditMode(false);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    return (
        <AccountContainer>
            <BackgroundContainer></BackgroundContainer>
            
            <ContentContainer>
                <BasicInfosContainer>
                    <img alt="user-image" src={user.urlImage} width={140} height={140} />
                    
                    <div>
                        <div>
                           <h2>{user.name}</h2>
                           <Image src='/assets/default/edit.png' alt='logo-editar' onClick={editarDado} width={18} height={18}/>
                        </div>
                        
                        <p>{user.email}</p>
                    </div>
                </BasicInfosContainer>

                <InfosContainer>

                    <div>
                        <ButtonsContainer>
                            <button onClick={() => mudarInformacao('perfil')}>Perfil</button>
                            <button onClick={() => mudarInformacao('pedidos')}>Pedidos</button>
                            <button onClick={() => mudarInformacao('pagamentos')}>Pagamento</button>
                        </ButtonsContainer>
                        <Line></Line>
                    </div>
                    
                    <InfoContainer>
                        {informacao === 'perfil' && <PerfilComponent userData={user} editMode={editMode} salvarDado={salvarDado} setUser={setUser}/>}
                        {informacao === 'pedidos' && <PedidosComponent/>}
                        {informacao === 'pagamentos' && <PagamentosComponent/>}
                    </InfoContainer>
                </InfosContainer>
            </ContentContainer>
        </AccountContainer>
    )
};

const InfosComponentStyled = styled('div', {
    paddingBottom: '4rem',
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.6rem',

    'div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '35rem',

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
            width: '20rem'
        }
    },

    'button': {
        padding: '1.2rem',
        width: '10rem',
        borderRadius: '10px',
        border: 'none',
        background: '$blue',
        color: '$white',
        fontSize: '1.1rem',
        marginLeft: '30rem',
        marginTop: '2rem'
    }
});

function PerfilComponent({ userData, editMode, salvarDado, setUser }: { userData: any, editMode: boolean, salvarDado: () => void, setUser: any }) {
    const [usuarioEditado, setUsuarioEditado] = useState(userData);

    useEffect(() => {
        setUsuarioEditado(userData);
    }, [userData]);

    useEffect(() => {
        if (editMode) {
           setUser(usuarioEditado); 
        }

    }, [usuarioEditado, editMode, setUser]);


    function editarUsuario(e: React.ChangeEvent<HTMLInputElement>) {
        setUsuarioEditado({...usuarioEditado, [e.target.name]: e.target.value});
    }

    return (
        <InfosComponentStyled>
            <div>
                <h3>Nome usuário</h3>
                {editMode ? (
                    <input type="text" name="text" value={usuarioEditado.name} onChange={editarUsuario}/>
                    ) : (
                    <h4>{userData.name}</h4>
                )}
            </div>
            <div>
                <h3>Email</h3>
                {editMode ? (
                    <input type="text" name="email" value={usuarioEditado.email} onChange={editarUsuario}/>
                    ) : (
                    <h4>{userData.email}</h4>
                )}
            </div>
            <div>
                <h3>Endereço</h3>
                {editMode ? (
                    <input type="text" name="address" value={usuarioEditado.address} onChange={editarUsuario}/>
                ) : (
                    <h4>{userData.address}</h4>
                )}
            </div>
            <div>
                <h3>CEP</h3>
                {editMode ? (
                    <input type="text" name="cep" value={usuarioEditado.cep} onChange={editarUsuario}/>
                ) : (
                    <h4>{userData.cep}</h4>
                )}
            </div>
            {editMode && <button onClick={salvarDado}>Salvar</button>}
        </InfosComponentStyled>
    )
};

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
    height: '100%'
});

const BackgroundContainer = styled('div', {
    width: '100vw',
    height: '18rem',
    background: '$grayMain'
});

const ContentContainer = styled('div', {
    width: '100vw',
    height: 'auto',
});

const BasicInfosContainer = styled('div', {
    width: '10rem',
    marginLeft: '3rem',
    display: 'flex',

    'img': {
        borderRadius: '70px',
        top: '-3.5rem',
        position: 'relative'
    },

    'div': {
        marginLeft: '1.2rem',
        
        'p': {
            color: '$grayLight'
        },

        'div': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '1rem 0 0.3rem -0rem',

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

const InfosContainer = styled('div', {
    width: '70rem',
    height: '30rem',
    marginLeft: '3rem',
});

const Line = styled('div', {
    background: '$blue',
    width: '100%',
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

const InfoContainer = styled('div', {});