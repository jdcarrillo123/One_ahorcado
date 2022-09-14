;(function(){
    "use strict"
    const pantalla1=document.querySelector(".pantalla1");
    const pantalla2=document.querySelector(".pantalla2");
    const pantalla3=document.querySelector(".pantalla3");
    const btnCancelar=document.querySelector("#btnCancelar");
    const btnDesistir=document.querySelector("#btnDesistir");
    const btnIniciar=document.querySelector("#btnIniciar");
    const btnNuevaPalabra=document.querySelector("#btnNuevaPalabra");
    const txtAgregarPalabra=document.querySelector("#txtAgregarPalabra");
    const lbl_informacion=document.querySelector(".lbl_informacion");
    const btnGuardar=document.querySelector("#btnGuardar");
    const letrasValidas = new RegExp("^[a-z]+$", "i"); //variable de letras permitidas
    var jugar=false;
    var nuevaPalabra=false;

    var palabras=[
        "ALURA",
        "PINO",
        "PERRO",
        "DINOSAURIO",
        "CHIHUAHUA",
        "MURCIELAGO",
        "ELEFANTE",
        "JIRAFA",
        "MUÑECA",
        "CHANGO"
        
    ]
    var juego=null;
    var terminado=false;
    var valores_html={
        hombre:document.getElementById("mono_ahorcado"),
        adivinado:document.querySelector(".letra_valida"),
        errado:document.querySelector(".letra_invalida")
    };
    function dibujar_ahorcado(juego){
        //Actualizar la imagen del hombre ahorcado
        var elemento;
        elemento=valores_html.hombre;
        var estado=juego.estado;
        if (estado===8){
            estado=juego.previo;
        }
        elemento.src="img/est/0" + estado + ".png";
        //Crear letras adivinadas
        var palabra=juego.palabra;
        var valida=juego.adivinado;
        elemento=valores_html.adivinado;
        //borrar elementos anteriores
        elemento.innerHTML="";
        for (let letra of palabra){
            let elemento_span=document.createElement("span");
            let elemento_txt=document.createTextNode("");
            if (valida.indexOf(letra)>=0){
                elemento_txt.nodeValue=letra;
            }
            elemento_span.setAttribute("class","letra correcta");
            elemento_span.appendChild(elemento_txt);
            elemento.appendChild(elemento_span);

        }
        //Creando las letras invalidas
        var invalida=juego.errado;
        elemento=valores_html.errado;
        elemento.innerHTML="";
        for (let letra of invalida){
           let elemento_span=document.createElement("span");
           let elemento_txt=document.createTextNode(letra);
           elemento_span.setAttribute("class","letra incorrecta")
            elemento_span.appendChild(elemento_txt);
            elemento.appendChild(elemento_span);
        }

    }
    function adivinar(juego,letra){
        var estado =juego.estado;
        //Si ya se ha perdido, o ganado termina el juego
        if (estado===1 || estado=== 8){
            return;
        }
        var adivinado= juego.adivinado;
        var errado=juego.errado;
        //si se adivina o se erra la letra no hace nada
        if (adivinado.indexOf(letra)>=0 || errado.indexOf(letra)>=0){
            return;
        }
        var palabra=juego.palabra;
        //si es la letra de la palabra
        if (palabra.indexOf(letra)>=0){
            let ganado=true;
            //ver si con esa letra se gana
            for (let l of palabra){
                if (adivinado.indexOf(l)<0 && l != letra){
                    ganado=false;
                    juego.previo=juego.estado;
                    break;
                }
            }
            //indicar si se ha ganado
            if (ganado){
                juego.estado=8;
            }
            //agregar la letra, a la lista de letras adivinadas
            adivinado.push(letra);
        }else{
            //Si no es la letra de la palabra, el hombre se acerca a la horca
            juego.estado--;
            errado.push(letra);
        }
    }
    function iniciarJuego(){
        if (jugar) {
            window.onkeypress=function adivinarLetra(e){
             var letra=e.key;
             letra=letra.toUpperCase();
             if (/[^A-ZÑ]/.test(letra)){
                 return
             }
            adivinar(juego,letra);
            var estado=juego.estado;
           
         
            if (estado===8 && !terminado){
             
             Swal.fire({
                 title:"FELICIDADES",
                 text:"Has ganado",
                 icon:"success"
             });
             terminado=true;
             
            }else if (estado===1 && !terminado){
             let palabra=juego.palabra;
             Swal.fire({
                 title:"FIN DEL JUEGO",
                 text:"Has perdido, la palabra correcta era: "+ palabra,
                 icon:"error"
             });
            
             terminado=true;
            }
             dibujar_ahorcado(juego);
            }
    
        }

    }
    window.jugarOtro=  function jugarOtro(){
    nuevaPalabra=true;
    nuevoJuego();

   }
       window.nuevoJuego=function nuevoJuego(){
        console.log(nuevaPalabra);
      
        if (nuevaPalabra){
            var palabra=palabraAleatoria();
            juego={};
            juego.palabra=palabra;
            juego.estado=7;
            juego.adivinado=[];
            juego.errado=[];
            terminado=false;
            dibujar_ahorcado(juego);
            console.log(juego);
        }else{
            var index=palabras.length;
            var palabrados=palabras[index-1];
            juego={};
            juego.palabra=palabrados;
            juego.estado=7;
            juego.adivinado=[];
            juego.errado=[];
            terminado=false;
            
            dibujar_ahorcado(juego);
            console.log(juego);
        }
    
       }

  
   function palabraAleatoria(){
    var index=Math.floor(Math.random()*palabras.length);
    return palabras[index];
   }

   function verificarNuevaPalabra(){
    //compara con letras validas y con el maximo de letras permitidas por palabra
    if((!letrasValidas.test(txtAgregarPalabra.value)) || txtAgregarPalabra.value.length>8){
        txtAgregarPalabra.value = txtAgregarPalabra.value.substring(0,((txtAgregarPalabra.value).length-1));
        lbl_informacion.style.color = "red";
    }else{
        txtAgregarPalabra.value = txtAgregarPalabra.value.toUpperCase();
        lbl_informacion.style.color="#495057";
    }
}

   function pantallaPrincipal(){
        pantalla2.style.display="none";
        pantalla3.style.display="none";
        pantalla1.style.display="block";
        jugar=false;

  }
  function pantallaDos(){
    pantalla1.style.display="none";
    pantalla3.style.display="none";
    pantalla2.style.display="block";
    txtAgregarPalabra.focus();
    txtAgregarPalabra.value="";
    txtAgregarPalabra.placeholder="Nueva palabra";
    lbl_informacion.style.color="#495057";
    jugar=false;
  }
  function pantallaTres(){
    pantalla1.style.display="none";
    pantalla2.style.display="none";
    pantalla3.style.display="block";
    jugar=true;
    nuevaPalabra=true;
    iniciarJuego();
    nuevoJuego();
  }
  function jugarNuevaPalabra() {
    if (txtAgregarPalabra.value==""){
       
    }else{
        palabras[palabras.length]=txtAgregarPalabra.value
        nuevaPalabra=false;
        pantalla1.style.display="none";
        pantalla2.style.display="none";
        pantalla3.style.display="block";
        jugar=true;
        iniciarJuego();
        nuevoJuego();
     
    }
   
  }
  function eliminaPalabraPrincipal(){
    if (!nuevaPalabra){
        palabras.pop();
    }
   
    pantallaPrincipal();
  }

  
//    nuevoJuego();
    btnIniciar.onclick=pantallaTres;
    btnCancelar.onclick=pantallaPrincipal;
    btnDesistir.onclick=eliminaPalabraPrincipal;
    btnGuardar.onclick=jugarNuevaPalabra;
    btnNuevaPalabra.onclick=pantallaDos;
    txtAgregarPalabra.oninput=verificarNuevaPalabra;
}())
