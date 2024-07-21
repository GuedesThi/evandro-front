import { styled } from "@stitches/react";
import { useState } from "react";
import Image from "next/image";

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
    background: '$grayMain'
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
})

interface User {
    name: string;
    email: string;
    urlImage: string;
    address: string;
    cep: string;
}

export default function Account() {
    const [user, setUser] = useState<User>({
        name: 'Thiago Guedes',
        email: 'thiagodossantosguedes@gmail.com',
        urlImage: 'https://th.bing.com/th/id/R.e024819076479f17acdc40d0b9cc6204?rik=eYpMYXtUCY%2bpMg&pid=ImgRaw&r=0',
        address: 'Estrada Mirandela 261',
        cep: '26520-332'
    });
    const [edicaoAtivada, setEdicaoAtivada] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>(user.name);
    const [newEmail, setNewEmail] = useState<string>(user.email);
    const [newAddress, setNewAddress] = useState<string>(user.address);
    const [newCep, setNewCep] = useState<string>(user.cep);
    const [informacao, setInformacao] = useState<string>('perfil');

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
        setUser(userAtual => (
            {...userAtual, name: newName, email: newEmail, address: newAddress, cep: newCep}
        ));
        setEdicaoAtivada(false);
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
                    
                    {informacao === 'perfil' && <PerfilComponent edicaoAtivada={edicaoAtivada} user={user} newName={newName} newEmail={newEmail} newAddress={newAddress} newCep={newCep} saveNewData={saveNewData} changeInput={changeInput} />}
                    {informacao === 'pedidos' && <PedidosComponent/>}
                    {informacao === 'pagamentos' && <PagamentosComponent/>}
                </InformationsContainer>
            </ContentContainer>

        </AccountContainer>
    )
};

const PerfilComponent = ({edicaoAtivada, user, newName, newEmail, newAddress, newCep, saveNewData, changeInput}: {edicaoAtivada: boolean, user: User, newName: string, newEmail: string, newAddress: string, newCep: string, saveNewData: any, changeInput: any}) => (
    <PerfilContainer>
        <Info>
            <h3>Nome usuário</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputNome" onChange={changeInput} value={newName}/>
            ) : (
                <h4>{user.name}</h4>
            )}
        </Info>

        <Info>
            <h3>Email</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputEmail" onChange={changeInput} value={newEmail}/>
            ) : (
                <h4>{user.email}</h4>
            )}
        </Info>

        <Info>
            <h3>Endereço</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputAddress" onChange={changeInput} value={newAddress}/>
            ) : (
                <h4>{user.address}</h4>
            )}
        </Info>

        <Info>
            <h3>CEP</h3>
            {edicaoAtivada ? (
                <input type="text" name="inputCep" onChange={changeInput} value={newCep}/>
            ) : (
                <h4>{user.cep}</h4>
            )}
        </Info>

            {edicaoAtivada ? (
                <button onClick={saveNewData}>Salvar</button>
            ) : (!edicaoAtivada)}
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