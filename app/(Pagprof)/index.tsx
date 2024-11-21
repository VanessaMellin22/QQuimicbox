import React, { useEffect, useState } from 'react';
import { View, Image, Text, TextInput, Pressable, ScrollView, ActivityIndicator  } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import theme from "@/theme"; 
import { Icon } from "react-native-elements";
import { Picker } from '@react-native-picker/picker'; // Importando o Picker 
import { launchImageLibrary } from 'react-native-image-picker';
import DropdownComponent from '../../components/Dropdawn';
import {Buffer} from "buffer" 
import { apiConfig } from '@/Utils/axios';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';


type Questoes = {
    id: string,
    enunciado: string,
    imagem: string,
    alternativa_a: string,
    alternativa_b: string,
    alternativa_c: string,
    alternativa_d: string,
    alternativa_e: string,
    correta: string,
    nivel: string
}

export default function Pagprof() {
    const [questoes, setQuestoes] = useState<Questoes[]>([])
    const [enunciado, setEnunciado] = useState<string>('');
    const [altA, setAltA] = useState<string>('');
    const [altB, setAltB] = useState<string>('');
    const [altC, setAltC] = useState<string>('');
    const [altD, setAltD] = useState<string>('');
    const [altE, setAltE] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<number>(0);
    const [selectedSubarea, setSelectedSubarea] = useState<number>(0);
    const [selectedNivel, setSelectedNivel] = useState<number>(0);
    //const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
        setImage(result.assets[0].uri);
        }
    };
 
    
        
    async function addnewquestion(){

            const form = new FormData();
            form.append('enunciado', enunciado);
            form.append('alternativa_a', altA);
            form.append('alternativa_b', altB);
            form.append('alternativa_c', altC);
            form.append('alternativa_d', altD);
            form.append('alternativa_e', altE);
            // colocar alternativa correta certa ----------------------------------------------- !!!!_-------------------------------- //
            form.append('correta', 'a');

            form.append('nivel', selectedNivel.toString());
            form.append('materia', selectedSubarea.toString());
            if(image){

                form.append('image', image)
            }

            const res = await apiConfig.post('/questao/new', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res)
            console.log(form)
    }
    
    // const handleImagePicker = () => {
    //     launchImageLibrary(
    //         {
    //             mediaType: 'photo',
    //             includeBase64: false,
    //         },
    //         (response) => {
    //             console.log(response); // Para depuração
    //             if (response.didCancel) {
    //                 console.log('User cancelled image picker');
    //             } else if (response.errorCode) {
    //                 console.log('ImagePicker Error: ', response.errorMessage);
    //             } else if (response.assets && Array.isArray(response.assets) && response.assets.length > 0) {
    //                 const imageUri = response.assets[0].uri;
    //                 // Verifica se imageUri é uma string antes de definir o estado
    //                 if (typeof imageUri === 'string') {
    //                     setSelectedImage(imageUri);
    //                 } else {
    //                     console.log('Unexpected URI type:', imageUri);
    //                 }
    //             } else {
    //                 console.log('No image selected or unexpected response structure');
    //             }
    //         }
    //     );
    // };
    

    function getArea(id: number){
        if(selectedArea != id){
            setSelectedArea(id)
        }
    }

    function getSubArea(id: number){
        if(selectedSubarea != id){
            setSelectedSubarea(id)
        }
    }

    function getLevel(id: number){
        if(selectedNivel != id){
            setSelectedNivel(id)
        }
    }

    const [loading, setLoading] = useState(false);

async function questsearch() {
    setLoading(true); // Indica que o carregamento começou
    try {
        const response = await apiConfig.get(`/questoes/${selectedArea}/${selectedSubarea}/${selectedNivel}`);
        if (Array.isArray(response.data)) {
            const questoesResumidas = response.data.map((questao) => {
                return {
                    ...questao,
                    enunciado: questao.enunciado.substring(0, 300) + '...',
                };
            });
            setQuestoes(questoesResumidas);
        } else {
            console.error("Resposta inesperada da API:", response.data);
        }
    } catch (error) {
        console.error("Erro ao buscar questões:", error);
    } finally {
        setLoading(false); // Indica que o carregamento terminou
    }
}
 



    return (
        <ScrollView>
            <ThemeProvider theme={theme}>
                <Container>
                     {/* parte da imagem inicial de BEM-VINDO */}
                    <Imgview>
                        <Image style={{ height: 780, width: '100%' }} source={require('../../assets/images/Testes.png')} />
                        
                        
                        <Apresentacao>
                            <Voltar>
                        <Link href='/(Inicial)'>
                        <Icon style={{marginBottom:300}}
                            name="keyboard-return"
                            type="material" 
                            color="white"
                            size={40}
                        /></Link></Voltar>
                        <Titulos>
                            <Title> Bem-vindo à página do Professor </Title>
                          <Subtitle>Compartilhe seus Conteúdos, Materiais Didáticos e Ferramentas Educativas</Subtitle>
                         </Titulos> 
                         </Apresentacao>
                        
                    </Imgview>

                   
        {/* parte de apresentação dos serviços */}
        <Section>
      <Title2>SERVIÇOS</Title2>
     
      
     <Section2>
        {/*adicionar questões */}
        <ServiceItem>
          <Content style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon name="post-add" size={30} color="#fff" />
            </Content>
          <Title3>Adicione Questões</Title3>
          <Subtitle3 >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
          </Subtitle3>
      </ServiceItem>

        {/*editar Questões */}
        <ServiceItem>
          <Content>
            <Icon name="edit" size={30} color="#fff" />
            </Content>
          <Title3>Edite Questões</Title3>
          <Subtitle3 >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
          </Subtitle3>
      </ServiceItem>

        {/* deletar questões*/}
        <ServiceItem>
          <Content>
            <Icon name="delete" size={30} color="#fff" />
            </Content>
          <Title3>Exclua Questões</Title3>
          <Subtitle3 >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
          </Subtitle3>
      </ServiceItem>
      </Section2>
    </Section>
    
                    {/*começo do adicionar questão */}
                <Contain>
                     {/* informativo da parte de adicionar questões */}
                <CardContainer>
                 <ImageCont>
                    <StyledImage
                        source={{ uri: '../../assets/images/Icons/question.png' }} // URL temporária
                    />
                </ImageCont>
                <TextContainer>
                    <Quote>Adicionar questão</Quote>
                    <TestimonialText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
                    </TestimonialText>
                </TextContainer>
            </CardContainer>
            {/* começo da área de questão e alternativas */}
                        <TextArea
                            multiline={true}
                            numberOfLines={5}
                            placeholder="Descreva sua questão aqui..."
                            value={enunciado}
                            onChangeText={text => setEnunciado(text)}
                        />
                    <Add>
                        <ViewQuestions1>
                           <ContArea>
                            {/* Áreas de Texto com Círculos */}
                            <TextAreaContainer key={'a'} >
                                <Circle>
                                    <CircleText>A</CircleText>
                                </Circle>
                                <TextArea2
                                        multiline={true}
                                        numberOfLines={2}
                                        placeholder={`Descreva sua alternativa A aqui...`}
                                        value={altA}
                                        onChangeText={text => setAltA(text)}
                                />
                            </TextAreaContainer>

                            <TextAreaContainer key={'b'} >
                                <Circle>
                                    <CircleText>B</CircleText>
                                </Circle>
                                <TextArea2
                                        multiline={true}
                                        numberOfLines={2}
                                        placeholder={`Descreva sua alternativa B aqui...`}
                                        value={altB}
                                        onChangeText={text => setAltB(text)}
                                />
                            </TextAreaContainer>

                            <TextAreaContainer key={'c'} >
                                <Circle>
                                    <CircleText>C</CircleText>
                                </Circle>
                                <TextArea2
                                        multiline={true}
                                        numberOfLines={2}
                                        placeholder={`Descreva sua alternativa C aqui...`}
                                        value={altC}
                                        onChangeText={text => setAltC(text)}
                                />
                            </TextAreaContainer>
                            <TextAreaContainer key={'d'} >
                                <Circle>
                                    <CircleText>D</CircleText>
                                </Circle>
                                <TextArea2
                                        multiline={true}
                                        numberOfLines={2}
                                        placeholder={`Descreva sua alternativa D aqui...`}
                                        value={altD}
                                        onChangeText={text => setAltD(text)}
                                />
                            </TextAreaContainer>
                            <TextAreaContainer key={'e'} >
                                <Circle>
                                    <CircleText>E</CircleText>
                                </Circle>
                                <TextArea2
                                        multiline={true}
                                        numberOfLines={2}
                                        placeholder={`Descreva sua alternativa E aqui...`}
                                        value={altE}
                                        onChangeText={text => setAltE(text)}
                                />
                            </TextAreaContainer>
               
                            </ContArea> 
                        </ViewQuestions1>   
                    </Add>
                         </Contain> 
                           <ViewQuestions>

                            {/* seletor de imagem */}
 <ImageUploadContainer>
            {image ? (
                <ImageContainer>
                    <SelectedImage source={{ uri: image }} resizeMode="contain" />
                </ImageContainer>
            ) : (
                <PlaceholderText></PlaceholderText>
            )}
            <Pressable onPress={pickImage}>
                <UploadButton>
                    <Icon name="add-a-photo" type="material" color="black" />
                    
                </UploadButton>
            </Pressable>
        </ImageUploadContainer>
        <DropdownComponent 
            funcaoArea={getArea}
            funcaoSubArea={getSubArea}
            funcaoNivel={getLevel}
        />
                        

                          
        <RoundButton onPress={addnewquestion}>
            <Icon style={{justifyContent: 'center', alignItems: 'center',}}
            name="add" 
            type="material" 
            color="white" 
            size={30} />
        </RoundButton>
                         
                     </ViewQuestions> 

       
                    
                      
                    {/*'banner informativo' de editar e excluir */}
                <CardContainer>
                <ImageCont>
                    <StyledImage
                        source={{ uri: '../../assets/images/Icons/pencil.png' }} 
                    />
                </ImageCont>
                <TextContainer>
                    <Quote>Edite</Quote>
                    <TestimonialText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
                    </TestimonialText>
                   
                </TextContainer>

                <ImageCont>
                    <StyledImage
                        source={{ uri: '../../assets/images/Icons/delete-file.png' }} 
                    />
                </ImageCont>
                <TextContainer>
                    <Quote>Delete</Quote>
                    <TestimonialText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
                    </TestimonialText>
                   
                </TextContainer>
            </CardContainer>
        
                    {/*segunda parte (editar e excluir) */}
                    <Add2>
                    {/* Seção de Área e Subárea */}

                    <Align>
                        {/* Seção de Área e Subárea */}
                        <DropdownComponent 
                            funcaoArea={getArea}
                            funcaoSubArea={getSubArea}
                            funcaoNivel={getLevel}
                        />
                        <RoundButton2 onPress={() => !loading && questsearch()}>
    {loading ? (
        <ActivityIndicator size="small" color="white" />
    ) : (
        <Icon 
            style={{ justifyContent: 'center', alignItems: 'center' }} 
            name="search" 
            type="material" 
            color="white" 
            size={30} 
        />
    )}
</RoundButton2>
                    </Align>

                    {/* Seção de Questões */}
                    <ContQuestion>
                    {questoes.map((questao) => (
                        <QuestaoContainer key={questao.id}>
                        <TextoQuestao>Questão: {questao.enunciado}</TextoQuestao>
                                <Acoes>
                                    <BotaoAcao>
                                        <Icon name="edit" type="material" color="white" />
                                    </BotaoAcao>
                                     <BotaoAcaoExcluir  >
                                    <Icon name="delete" type="material" color="white" />
                                    </BotaoAcaoExcluir>
                                </Acoes>
                        </QuestaoContainer>
                    ))}</ContQuestion>
                     </Add2>
                
                </Container>
            </ThemeProvider>
        </ScrollView>
    );
}

const Container = styled.View`
    background-color: ${({theme}) => theme.COLORS.WHITE};
`
const Imgview = styled.View`
    width: 100%;
    
`

const Title = styled.Text`
    font-size:  ${({theme}) => theme.FONT_SIZE.XXL} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.WHITE} ;
    text-align: center;
`

const Subtitle = styled.Text`
    font-size:  ${({theme}) => theme.FONT_SIZE.LG} ;
    color: ${({theme}) => theme.COLORS.GRAY_200} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
`

const Section = styled.View`
    flex: 1;
    align-Items: 'center';
    padding: 20px;
    align-items: center;
    justify-content:center;
    gap:40px;
`
const Section2 = styled.View`
    gap:70px;
    width: '100%';
    flex-direction: row;
    align-items: center;
    justify-content:center;
    margin-bottom:-500px;
    
`

const Apresentacao = styled.View`
    height: 100%;
   
    
`

const Title2 = styled.Text`
    color: ${({theme}) => theme.COLORS.GRAY_700} ;
    font-size:  ${({theme}) => theme.FONT_SIZE.XXL} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
    text-align: center;
`
const Title3 = styled.Text`
    font-size:  ${({theme}) => theme.FONT_SIZE.XXL} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.BLUE_700} ;
    text-align: center
`
const Subtitle3 = styled.Text`
    width: 25rem;
    padding-left: 1rem;
    text-align:center;
`

const Content = styled.Text`
    background-Color:  ${({theme}) => theme.COLORS.BLUE_700} ;
    padding: 15px;
    border-Radius: 50px;
    margin-Bottom: 10px;
    height: 60;
    width: 60;
`
const ServiceItem = styled.View`
    align-Items: 'center';
    width: '30%';
    flex-direction:column;
    align-items: center;
    justify-content:center;
`
const Add = styled.View` 
    margin-top:1rem;
    flex-direction: column;
    width: 80rem;
    align-items:center;
    justify-content:center 
`

const TextArea = styled.TextInput`
    height: 170px;
    width:90%;
    border-radius:2rem;
    padding: 18px;
    background-color: ${({ theme }) => theme.COLORS.WHITE}; 
    margin-bottom: 16px;
    margin-left: 68px;
    align-items:center;
    justify-content:center;
`
const ContArea= styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-left:80px;
    justify-content: space-between; /* Espaça os elementos para se alinharem em colunas */
`
const TextAreaContainer = styled.View`
    flex-direction: row;
    width: 49%; /* Cada elemento ocupará quase metade da largura, formando duas colunas */
    align-items:center;
    justify-content:center;
    margin-bottom: 8px; /* Ajusta o espaçamento entre linhas */
`

const Circle = styled.View`
    width: 30px;
    height: 30px;
    border-radius: 15px; /* Círculo */
    background-color: ${({ theme }) => theme.COLORS.BLUE_200};
    align-items: center;
    justify-content: center;
`

const CircleText = styled.Text`
    color: white;
    font-weight: bold;
`
const TextArea2 = styled.TextInput`
    height: 80px;
    width:900px;
    background-color: ${({ theme }) => theme.COLORS.WHITE}; 
    border-radius:1rem;
    padding: 17px;
    text-align: top;
    margin-top:0.5rem;
    margin-left:0.5rem;
`
const ViewQuestions = styled.View`
    height:220px;
    flex-direction:row;
    margin-top:1px;
    background-color: ${({ theme }) => theme.COLORS.BLUE_700}; 
    align-items:center;
    justify-content:center;
    gap:2px;

`
const ViewQuestions1 = styled.View`
    flex-direction:column;
    margin-left:100px;
    margin-bottom:40px;
    align-items:center;
    justify-content:center;
`
const ImageUploadContainer = styled.View`
    align-items: center;
    flex-direction:row;
    right:8%;
`
const ImageContainer = styled.View`
    height: 200px; /* Defina a altura desejada */
    width: 200px; /* Defina a largura desejada */
    right:20px
`
const SelectedImage = styled.Image`
    height: 100%;
    width: 100%;
   
`
const PlaceholderText = styled.Text`
    font-size: 14px;
    color: gray;
`
const UploadButton = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    border-radius: 5px;
    padding: 10px;
`
const RoundButton = styled(Pressable)`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: green;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    left:1370px;
`
const QuestaoContainer = styled.View`
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    border-radius: 10px;
    margin-bottom: 10px;
    height: 80px;
    box-shadow: 0 2px 4px ${({ theme }) => theme.COLORS.WHITE_BLUE};
    flex-direction: row;
    align-items: center;
    width: 90%;
    padding: 10px; /* Espaço interno para manter os elementos dentro */
`
const TextoQuestao = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    flex: 1;
    flex-wrap: wrap;
`;
const Acoes = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-left: 10px; /* Espaço entre o texto e os botões */
`
const BotaoAcao = styled(Pressable)`
    background-color: #4c9baf;
    padding: 10px;
    border-radius: 200px;
    height: 45;
    width: 45;
`

const BotaoAcaoExcluir = styled(Pressable)`
    background-color: #F44336;
    padding: 10px;
    border-radius: 200px;
    height: 45;
    width: 45;
`
const Add2 = styled.View`
    border-radius:2px;
    background-color: ${({ theme }) => theme.COLORS.BLUE_700}; 
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 100%;
`
const ContQuestion = styled.View`
    align-items: center;
    justify-content: center;
    border-radius: 15px;
`
const CardContainer = styled.View`
    flex-direction: row;
    background-color: ${({ theme }) => theme.COLORS.BLUE_500};
    padding: 20px;
    margin: 70px;
    border-radius: 10px;
`

const ImageCont = styled.View`
    overflow: hidden;
    margin-right: 15px;
    margin-left:20px
`

const StyledImage = styled.Image`
    width: 70px;
    height: 70px;
    border-radius: 25px;
`

const TextContainer = styled.View`
    flex: 1;
    gap: 15;
`

const Quote = styled.Text`
    font-size: 25px;
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-weight: bold;
    margin-bottom: -10px
`

const TestimonialText = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.COLORS.WHITE};
    line-height: 22px;
`

const Contain = styled.View`
    justify-Content: 'center';
    align-Items: 'center';
    margin-Top:800px;
    background-color: ${({ theme }) => theme.COLORS.BLUE_700};
    
 `

 const RoundButton2 = styled(Pressable)`
    width: 50px;
    height: 50px;
    border-radius: 30px;
    background-color:${({ theme }) => theme.COLORS.GRAY_200};
    align-items: center;
    justify-content: center
    
`
const Align = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    `
const Titulos = styled.View`
    flex-direction: column;
    align-items:center;
    
`
const Voltar = styled.View`
  flex-direction: column;
    align-items:start;
    justify-content:start;
    margin-top:-760px;
    margin-left:5px;
`