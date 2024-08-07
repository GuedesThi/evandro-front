import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "@stitches/react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Product() {
    const [productData, setProductData] = useState<any>(null); 
    const [quantityProduct, setQuantityProduct] = useState<number>(1);
    const router = useRouter();

    async function initialRequest() {
        const { id } = router.query;

        try {
            const response = await fetch(`https://decasametais.com/product/${id}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();

                console.log(data);

                setTimeout(() => {
                    setProductData(data);
                }, 1000);
                
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    useEffect(() => {
        if (router.query.id) {
            initialRequest();
        }
    }, [router.query.id]); 

    function formatPrice(price: number) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    function handleMoreQuantity() {
        setQuantityProduct(quantityProduct + 1);
    };

    function handleLessQuantity() {

        if (quantityProduct > 0) {
            setQuantityProduct(quantityProduct - 1);
        }
    }

    if (!productData) {
        return (
            <ProductContainer>
                <ProductTemplate>
                    <SkeletonTheme baseColor="#5a5959" highlightColor="#2b2b2b">
                        <LeftSide>
                            <Skeleton height={300} width={300} />
                        </LeftSide>
                        
                        <RightSide>
                            <ContentLine>
                                <Skeleton width={500} height={40} />
                            </ContentLine>
                            <ContentLine>
                                <Skeleton width={180} />
                            </ContentLine>
                            <ContentLine>
                                <Skeleton width={210} height={50} />
                                <Skeleton width={160} height={50} />
                            </ContentLine>
                            <ContentLine>
                                <Skeleton width={120} />
                            </ContentLine>
                            
                            <ContentLine>
                                <ContentLine>
                                    <button>
                                        <Skeleton width={20} />
                                        <Skeleton width={100} />
                                    </button>
                                </ContentLine>
                                <ContentLine></ContentLine>
                            </ContentLine>
                        </RightSide>
                    </SkeletonTheme>
                </ProductTemplate>
            </ProductContainer>
                    
        );
    
    } else {
        return (
            <ProductContainer>
                <ProductTemplate>
                    <LeftSide>
                        <img src={productData.imagesUrl[0]} alt={`Produto ${productData.name}`}/>
                    </LeftSide>
                    
                    <RightSide>
                        <ContentLine>
                            <h1>{productData.name}</h1>
                        </ContentLine>
                        <ContentLine>
                            <h6>Código do produto: {productData.productCode}</h6>
                        </ContentLine>
                        <ContentLine>
                            <h2>{formatPrice(productData.price)}</h2>
                            <h3>({productData.parcelas}x de R$ 200,00)</h3>
                        </ContentLine>
                        <ContentLine>
                            <h6>Em Estoque: {productData.emEstoque}</h6>
                        </ContentLine>
                        
                        <ContentLine>
                            <ContentLine>
                                <button>
                                    <img src='/assets/default/document.png'/>
                                    <span>Documentos</span>
                                </button>
                            </ContentLine>
                            <ContentLine></ContentLine>
                        </ContentLine>

                        <ContentLine>
                            <ContentLine>
                                <button onClick={handleLessQuantity}>
                                    <h4>-</h4>
                                </button>
                                <p>{quantityProduct}</p>
                                <button onClick={handleMoreQuantity}>
                                    <h4>+</h4>
                                </button>
                            </ContentLine>
                            <ContentLine>
                                <AddShop>
                                    <h2>ADICIONAR AO CARRINHO</h2>
                                </AddShop>
                            </ContentLine>
                        </ContentLine>
                        
                        <ContentLine>
                            <BtnBuy>
                                <h2>COMPRAR PRODUTO</h2>
                            </BtnBuy>
                        </ContentLine>
                    </RightSide>
                </ProductTemplate>
            </ProductContainer>
        );
    }
};

const ProductContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem 0'
});

const ProductTemplate = styled('div', {
    display: 'flex',
    marginLeft: '12rem',
    gap: '10rem'
});

const LeftSide = styled('div', {
    padding: '3rem 0',

    'img': {
        width: '20rem',
        height: '22rem'
    }
});

const RightSide = styled('div', {
    width: '32rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
});

const ContentLine = styled('div', {
    alignItems: 'center',
    gap: '0.7rem',
    display: 'flex',

    'h1': {
        color: '$grayMain',
        fontFamily: '$text',
        fontSize: '1.9rem',
        fontWeight: '600'
    },

    'h2': {
        color: '$blue',
        fontSize: '2.4rem',
        marginTop: '1rem',
        fontWeight: '600'
    },

    'h3': {
        color: '$grayMain',
        fontFamily: '$text',
        fontSize: '1rem',
        marginTop: '1.3rem',
        fontWeight: '100'
    },

    'h6': {
        color: '$grayLight',
        fontFamily: '$text',
        fontSize: '0.9rem',
        fontWeight: '100'
    },

    'span': {
        color: '$grayLight',
        fontFamily: '$text',
        fontSize: '0.9rem',
        fontWeight: '100',
        marginTop: '1rem'
    },

    'p': {
            fontSize: '1.4rem',
            padding: '0 1rem',
            marginTop: '1.2rem'
    },

    'button': {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: 'none',
        marginTop: '1rem',

        'img': {
            width: '1.4rem',
            marginTop: '1rem'
        },

        'h4': {
            color: '$blue',
            fontSize: '1.5rem',
        }
    }

});

const AddShop = styled('button', {
    marginLeft: '2.5rem', 
    background: '$blue',
    padding: '1rem',
    borderRadius: '30px',
     
    'h2': {
        margin: '0',
        color: '$white',
        fontFamily: '$text',
        fontSize: '1.3rem'
     }
});

const BtnBuy = styled('button', {
    background: '$blue',
    padding: '1.2rem 7rem',
    borderRadius: '10px',
     
    'h2': {
        margin: '0',
        color: '$white',
        fontFamily: '$text',
        fontSize: '1.3rem'
     }
})