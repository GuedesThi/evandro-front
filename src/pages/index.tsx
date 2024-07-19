import { styled } from "@stitches/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/products');
  const data = await response.json();

  return { props: { data } };
}

interface Products {
  id: number;
  name: string;
  price: string;
  url: string;
}

interface HomeProps {
  data: Products[];
}

export default function Home({ data }: HomeProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <HomeContainer>
      <TwoLinks>
        <Link href='/'>
          <Image src='/assets/default/home.png' alt='home-icone' width={15} height={16} />
          <span>Página inicial</span>
        </Link>

        <a onClick={toggleSidebar}>
          <Image src='/assets/default/categoric.png' alt='categorias-icone' width={17} height={18} />
          <span>Categorias</span>
        </a>
      </TwoLinks>

      <ContentPage>
        <Sidebar style={{ right: showSidebar ? '0' : '-24rem' }}>

          <h2>CATEGORIAS</h2>
          {data.map(i => (
            <Categoric key={i.id} href={`/categoric/${i.id}`}>
              <Image src={i.url} alt='categoria' width={50} height={50}/>
              <p>{i.name}</p>
            </Categoric>
          ))}

          <button onClick={closeSidebar}>Fechar</button>
        </Sidebar>

        <Lancamentos>
          <h2>Lançamentos</h2>

          <Slider key={data.length} {...settings} className="custom-slick-slider">
            {data.map(produto => (
              <Produto key={produto.id} href={`/product/${produto.id}`}>
                <Image src={produto.url} alt='produto' width={205} height={210} />
                <Info>
                  <h3>{produto.name}</h3>
                  <h4>R${produto.price}</h4>
                </Info>
              </Produto>
            ))}
          </Slider>
        </Lancamentos>

        <MaisVendidos>
          <h2>Mais vendidos</h2>

          <Slider key={data.length} {...settings} className="custom-slick-slider">
            {data.map(produto => (
              <Produto key={produto.id} href={`/product/${produto.id}`}>
                <Image src={produto.url} alt='produto' width={205} height={210} />
                <Info>
                  <h3>{produto.name}</h3>
                  <h4>R${produto.price}</h4>
                </Info>
              </Produto>
            ))}
          </Slider>
        </MaisVendidos>

        <MelhoresPrecos>
          <h2>Melhores preços</h2>

          <Slider key={data.length} {...settings} className="custom-slick-slider">
            {data.map(produto => (
              <Produto key={produto.id} href={`/product/${produto.id}`}>
                <Image src={produto.url} alt='produto' width={205} height={210} />
                <Info>
                  <h3>{produto.name}</h3>
                  <h4>R${produto.price}</h4>
                </Info>
              </Produto>
            ))}
          </Slider>
        </MelhoresPrecos>
      </ContentPage>
    </HomeContainer>
  );
}

const HomeContainer = styled('div', {
  width: '100vw',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '4rem',

  '@media(max-width: 720px)': {
    gap: '1rem',
    background: '$white'
  },
});

const TwoLinks = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  width: '20%',
  marginLeft: '3rem',

  '@media(max-width: 720px)': {
    padding: '2rem 0',
    marginLeft: '1.3rem',
    width: '90%'
  },

  'a': {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',

    '@media(max-width: 720px)': {
      gap: '0.4rem',
    },

    'span': {
      fontFamily: '$text',
      color: '$grayLight',
      fontSize: '0.9rem',

      '@media(max-width: 720px)': {
        color: '$grayLight'
      },
    },
  },
});

const ContentPage = styled('div', {
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const Produto = styled('a', {
  width: '1rem',
  margin: '3.5rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.4s ease-in-out',

  '@media(max-width: 720px)': {
    margin: '3.6rem',
    height: 'auto',
  },

  '&:hover': {
    transform: 'scale(1.1)',
  },

  '&:focus': {
    outline: 'none',
  },
});

const Info = styled('div', {
  width: '13rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem 0',
  gap: '0.8rem',

  '@media(max-width: 720px)': {
  },

  'h3': {
    fontFamily: '$text',
    fontWeight: '400',
    color: '$grayMain',
    fontSize: '0.9rem',
    textAlign: 'center',

    '@media(max-width: 720px)': {
      color: '$grayMain'
    },
  },

  'h4': {
    fontFamily: '$text',
    fontWeight: 'bold',
    color: '$blue',
    fontSize: '1.1rem',
  },
});

const Lancamentos = styled('div', {
  marginBottom: '4rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',

  '@media(max-width: 720px)': {
    height: '32rem',
    padding: '1rem 0 0 0',
    marginBottom: '1rem'
  },

  'h2': {
    marginLeft: '3rem',
    fontFamily: '$text',
    fontWeight: '100',
    fontSize: '2rem',

    '@media(max-width: 720px)': {
      marginLeft: '1.3rem'
    },
  },

  '.custom-slick-slider': {
    margin: '0rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',

    '.slick-prev, .slick-next': {
      '&:before': {
        color: '$blue',
        fontSize: '25px',

        // Não aparce os botões de passar para o lado 
        '@media(max-width: 720px)': {
          display: 'none',
        },
      },
      zIndex: 1,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    },

    '.slick-prev': {
      color: 'blue',
      left: '10px',
    },

    '.slick-next': {
      color: 'blue',
      right: '15px',
    },

    // Estilizar bolinhas
    '.slick-dots': {
      display: 'flex !important',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem', 
      margin: '3rem', // distância das bolinhas com o Slide

      'li': {
        margin: '0', 
      },

      'button': {
        '&:before': {
          fontSize: '15px',
          color: '$blue',
        },
      },
    },
  },
});

const MaisVendidos = styled('div', {
  marginBottom: '4rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',

  '@media(max-width: 720px)': {
    marginTop: '2rem'
  },

  'h2': {
    marginLeft: '3rem',
    fontFamily: '$text',
    fontWeight: '100',
    fontSize: '2rem',

    '@media(max-width: 720px)': {
      marginLeft: '1.3rem'
    },
  },

  '.custom-slick-slider': {
    margin: '0rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',

    '.slick-prev, .slick-next': {
      '&:before': {
        color: '$blue',
        fontSize: '25px',

        // Não aparce os botões de passar para o lado 
        '@media(max-width: 720px)': {
          display: 'none',
        },
      },
      zIndex: 1,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    },

    '.slick-prev': {
      color: 'blue',
      left: '10px',
    },

    '.slick-next': {
      color: 'blue',
      right: '15px',
    },

    // Estilizar bolinhas
    '.slick-dots': {
      display: 'flex !important',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem', 
      margin: '3rem', // distância das bolinhas com o Slide

      'li': {
        margin: '0', 
      },

      'button': {
        '&:before': {
          fontSize: '15px',
          color: '$blue',
        },
      },
    },
  },
});

const MelhoresPrecos = styled('div', {
  marginBottom: '4rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',

  '@media(max-width: 720px)': {
    marginTop: '2rem'
  },

  'h2': {
    marginLeft: '3rem',
    fontFamily: '$text',
    fontWeight: '100',
    fontSize: '2rem',

    '@media(max-width: 720px)': {
      marginLeft: '1.3rem'
    },
  },

  '.custom-slick-slider': {
    margin: '0rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',

    '.slick-prev, .slick-next': {
      '&:before': {
        color: '$blue',
        fontSize: '25px',

        // Não aparce os botões de passar para o lado 
        '@media(max-width: 720px)': {
          display: 'none',
        },
      },
      zIndex: 1,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',

      '@media(max-width: 720px)': {
        display: 'none',
      },
    },

    '.slick-prev': {
      color: 'blue',
      left: '10px',
    },

    '.slick-next': {
      color: 'blue',
      right: '15px',
    },

    // Estilizar bolinhas
    '.slick-dots': {
      display: 'flex !important',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem', 
      margin: '3rem', // distância das bolinhas com o Slide

      'li': {
        margin: '0', 
      },

      'button': {
        '&:before': {
          fontSize: '15px',
          color: '$blue',
        },
      },
    },
  },
});

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Sidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2.6rem',
  position: 'fixed',
  top: 0,
  right: '-24rem', // Inicialmente fora da tela
  height: '100%',
  width: '24rem',
  backgroundColor: '$grayMain',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  transition: 'right 0.3s ease-in-out',
  zIndex: 1000,
  overflowY: 'auto',
  padding: '2rem 1.5rem',

  'h2': {
    color: '$white',
    fontWeight: '100',
    fontSize: '1.5rem',

    '@media(max-width: 720px)': {
      fontWeight: '400'
    },
  },

  'button': {
    background: '$blue',
    color: '$white',
    border: 'none',
    padding: '1rem',
    cursor: 'pointer',
    fontSize: '1.2rem',
    borderRadius: '8px'
  }
});

const Categoric = styled('a', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.9rem',

  'img': {
    borderRadius: '10rem'
  },
  'p': {
    fontWeight: '100',
    color: '$lue',
    fontSize: '1rem',

    '@media(max-width: 720px)': {
      fontWeight: '400'
    },
  }
})