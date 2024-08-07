import { styled } from "@stitches/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface DefaultLayoutProps {
    children: React.ReactNode
}

// Se o Estado 'havePadding' estiver com 'true' o ícone terá um Padding. E, caso esteja com 'false' não terá.
const AccountIcon = styled('img', {
    background: '$blue',
    borderRadius: '8px',
    padding: '0',
    transition: 'all 0.3s ease-in-out',
    variants: {
        havePadding: {
            true: {
                padding: '0.3rem',
            },
            false: {
                padding: '0',
            }
        },
    },

    '&:hover': {
        transform: 'scale(1.1)'
    }
});

export default function DefaultLayout({children}: DefaultLayoutProps) {

    // Estado para quando o usuário apertar o ícone para ir para a conta;
    const [botaoApertado, setBotaoApertado] = useState<boolean>(false);
    // Estado para sabermos se o Token que enviamos na requisição está válido ou não (Status 403);
    const [tokenExpirado, setTokenExpirado] = useState<boolean>(false);
    // Estado que guarda o Object com os Dados do usuários;
    const [user, setUser] = useState<any>({});
    // Estado que guarda a url da imagem do ícone para ir para a conta;
    const [url, setUrl] = useState<string>('/assets/default/account.png');
    // Estado que guarda o tamanho do ícone para ir para a conta. Ele tem que ser pequena quando não estiver com o usuário logado, e grande quando estiver;
    const [sizeImg, setSizeImg] = useState<number>();
    // Estado que diz que tem Padding (quando o usuário não está logado), ou, se não tem (usuário está logado);
    const [havePadding, setHavePadding] = useState<boolean>(false);

    const router = useRouter();

    // Function para: Enviar o Token do usuário + Pegar os Dados do usuário;
    async function requestUserData(token: string) {
        
        try {
            // Enviamos o Token
            const response = await fetch('https://decasametais.com/api/auth/account', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            // Se o Token não estiver vencido;
            if (response.ok) {
                // Pegamos os Dados do usuário, e, salvamos num Estado;
                const userData = await response.json();
                setUser(userData);
                // Retornamos 'true' para fazermos algo no useEffect() que está usando essa Function;
                return true;

            // Se o Token estiver vencido, será retornado um Status 403;
            } else if (response.status == 403) {
                // Avisamos que o Token está expirado;
                setTokenExpirado(true);

            // Erro qualquer;
            } else {
                console.error('Erro ao obter informações do usuário:', response.statusText);
                return false;
            }

        // Erro na requisição;
        } catch (error) {
            console.error('Erro na requisição:', error);
            return false;
        }
    };

    // Roda quando o usuário entra na página. Usamos esse useEffect() exclusivamente para escolher a imagem do ícone para ir para conta;
    useEffect(() => {
        
        // Pegamos o Token salvo (só vale por 2 horas);
        const token = localStorage.getItem('token');

        // Caso não tenha nenhum Token;
        if (token == null || token == undefined) {
            console.log('nothing');

        // Caso tenha um Token;
        } else {
            // Só rodará se o usuário não cliclou no ícone;
            if (!botaoApertado) {
                // Fazemos a requisição, será retornado 'true' ou 'false' (que nem programamos em requestUserData());
                requestUserData(token).then((sucess) => {
                    // Se for retornado 'true';
                    if (sucess) {
                        /* Falamos que o valor de 'userUrl' será a url enviada pelo servidor que salvamos no Estado 'user'.
                           Mas, caso não tenha nenhum Dado salvo em 'user' (ou seja, não fizemos login), teremos um valor default; */
                        setUrl(user.urlImage || '/assets/default/account.png');
                    }
                });
            }
        }
    }, []);

    // Roda quando o Estado de 'user' muda, ou seja, ele mudará após o useEffect() acima (caso tenhámos um Token);
    useEffect(() => {
        // Se o Estado 'user' tiver o Dado 'urlImage', passaremos esse valor como a url de 'url';
        if (user.urlImage) {
            setUrl(user.urlImage);
        }
    }, [user]);

    // Roda quando o usuário aperta no ícone de ir para a conta;
    useEffect(() => {
        // Pegamos o Token salvo (só vale por 2 horas);
        const token = localStorage.getItem('token');

        // Se o usuário apertou o ícone;
        if (botaoApertado) {
            // Verifica se há token
            if (!token) {
                // Se não houver token, redireciona para login substituindo a entrada no histórico
                router.replace('/login');
            } else {
                // Fazemos a requisição, será retornado 'true' ou 'false' (que nem programamos em requestUserData());
                requestUserData(token).then((success) => {
                    // Se for retornado 'true', enviamos o usuário para a página de conta;
                    if (success) {
                        router.push('/account');
                        // Por fim, devemos retornar 'botaoApertado' para seu Estado 'false', para que o usuário sempre possa apertar ele;
                        setBotaoApertado(false);
                    } else {
                        // Se não for retornado 'true', enviamos o usuário para fazer Login;
                        router.replace('/login');
                    }
                });
            }
        }
    }, [botaoApertado]);

    // Roda quando o Estado de 'url' muda;
    useEffect(() => {
        // Se o Estado estiver com seu valor padrão, diminuimos seu tamanho, e, colocamos um Padding;
        if (url == '/assets/default/account.png') {
            setSizeImg(30);
            setHavePadding(true);

        // Se o Estado não estiver com seu valor padrão (ou seja, com uma url vinda do Banco de Dados), aumentamos seu tamanho, e, tiramos o Padding;
        } else {
            setSizeImg(45);
            // Sem isso não funciona a imagem com a url do banco de dados ficar sem o padding;
            setHavePadding(false); 
        }
    }, [url]);

    return (
        <DefaultLayoutContainer>
            <DefaultHeader>
                <Link href='/'>
                    <h1>Decasa Metais</h1>
                </Link>

                <Line/>

                <SearchContainer>
                    <SearchInput placeholder="O que você deseja hoje?" />
                    <SearchIcon src='/assets/default/search.png' alt='logo-pesquisar' width={20} height={20}/>
                </SearchContainer>

                <IconsContainer>
                    <Link href="/">
                        <AccountIcon
                            onClick={() => setBotaoApertado(true)}
                            src={url}
                            width={sizeImg}
                            height={sizeImg}
                            alt='icone-conta'
                            havePadding={havePadding} 
                        />
                    </Link>

                    <Line />

                    <Link href="/shop">
                        <ShopIcon src='/assets/default/shop.png' width={30} height={30} alt='icone-carrinho' />
                    </Link>
                </IconsContainer>

            </DefaultHeader>
            <LineLarge/>

            <ContentContainer>
                <main>{children}</main>
            </ContentContainer>

            <DefaultFooter>
                <FooterSymbol>
                    <h3>USE +</h3>
                    <span>DECASA METAIS</span>
                </FooterSymbol>
            </DefaultFooter>
        </DefaultLayoutContainer>
    )
}

const DefaultLayoutContainer = styled('div', {
    width: '100vw',
    height: 'auto',

    'a': {
        textDecoration: 'none',
        color: '$blue',
        cursor: 'pointer',

        'h1': {
            fontFamily: '$title',

            '@media(max-width: 720px)': {
                fontSize: '1.1rem'
            }
        }
    }
})

const DefaultHeader = styled('header', {
    padding: '2rem 2rem 2rem 3rem',
    width: '100vw',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '3.1rem',

    '@media(max-width: 720px)': {
        padding: '1.8rem 0.9rem 1.8rem 1.3rem',
        gap: '0.4rem',   
    }

})

const Line = styled('div', {
    background: '$blue',
    width: '0.2rem',
    height: '2.4rem',
    borderRadius: '10px',

    '@media(max-width: 720px)': {
        width: '0.1rem',
        display: 'none'
    }
})

const SearchContainer = styled('div', {
    position: 'relative',
    width: '38rem',
    marginLeft: '2rem',

    '@media(max-width: 720px)': {
        width: '21rem',
        marginLeft: '0'
    }
})

const SearchInput = styled('input', {
    padding: '0.9rem 1rem',
    width: '100%',
    border: '2px solid $grayLight',
    borderRadius: '26px',
    paddingRight: '3rem',
    fontFamily: '$text',
    fontWeight: '400',
    fontSize: '1rem',
    cursor: 'pointer',

    '@media(max-width: 720px)': {
      padding: '0.6rem 0.7rem 0.7rem 0.9rem',
      paddingRight: '1.1rem',
      borderRadius: '21px'
    },

    '&:hover': {
        border: '2px solid $blue',
    },

    '&:focus': {
        border: '2px solid $blue',
        outline: 'none',
    },

    '&::placeholder': {
        fontFamily: '$text',
        color: '$grayLight',

        '@media(max-width: 720px)': {
            fontSize: '0.8rem'
        }
    }
})

const SearchIcon = styled(Image, {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',

    '@media(max-width: 720px)': {
        display: 'none', 
    }
})

const IconsContainer = styled('div', {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginLeft: '2rem',

    '@media(max-width: 720px)': {
      marginLeft: '0.6rem',
      gap: '0.7rem'
    }
})

const ShopIcon = styled('img', {
    background: '$blue',
    borderRadius: '8px',
    padding: '0.3rem',
    transition: 'all 0.3s ease-in-out',

    '@media(max-width: 720px)': {
        padding: '0.4rem'
    },

    '&:hover': {
        transform: 'scale(1.3)'
    }
})

const ContentContainer = styled('div', {
    padding: '3rem 0',
    width: '100vw',
    height: 'auto',

    '@media(max-width: 720px)': {
       padding: '0'     
    }
})

const LineLarge = styled('div', {
    background: '$blue',
    width: '100vw',
    height: '2.8rem',

    '@media(max-width: 720px)': {
       height: '1rem'     
    }
})

const DefaultFooter = styled('footer', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '$black',
    width: '100vw',
    height: '30rem',
})

const FooterSymbol = styled('div', {
    padding: '1rem 0.5rem',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    gap: '0.6rem',
    width: '21.5rem',
    background: '$grayMain',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    'h3, span': {
        fontFamily: '$title',
        fontWeight: '400',
        fontSize: '2rem'
    },

    'h3': {
        color: '$white'
    },

    'span': {
        color: '$blue'
    }
})