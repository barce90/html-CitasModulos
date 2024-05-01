const criptomodedasSelect = document.querySelector('#criptomonedas');
const mondedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


//crear un promise

const obtenerCriptomonedas = criptomonedas => new Promise( resolve =>{
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => { 
    cosultarMonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomodedasSelect.addEventListener('change', leerValor);

    mondedasSelect.addEventListener('change', leerValor);

})
//con async await
async function cosultarMonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptmonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptmonedas);

    } catch (error) {
        console.log(error);
    }
}

//con fetch y promises 
/*
function cosultarMonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then (criptomonedas => selectCriptomonedas(criptomonedas))
}
*/

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomodedasSelect.appendChild(option);

    });
}

function leerValor(e){
   // console.log(e.target.name);
    objBusqueda[e.target.name] = e.target.value;
    //console.log(objBusqueda);

}

function submitFormulario(e){
    e.preventDefault();

    //validar formulario
const { moneda, criptmoneda } = objBusqueda;

if( moneda === '' || criptmoneda === '' ){
    mostrarAlerta ('Ambos Campos son obligatorios');
    return;
}

//consultar API
consultarAPI();


}


function mostrarAlerta(msg){

    const existeError = document.querySelector('.error');

    if(!existeError){

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        //mensaje de error
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

   
}

//con fectch y promises

/*
function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    console.log(objBusqueda);

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;


    mostrarSpiner();

    fetch(url)
        .then (respuesta => respuesta.json())
        .then (cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}
   */
  
//con async await

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    console.log(objBusqueda);

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;


    mostrarSpiner();

    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);


    } catch (error) {
        console.log(error);
    }
}
   

function mostrarCotizacionHTML(cotizacion){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion de las ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Variacion de las ultimas 24 horas <span>${LASTUPDATE}</span>`;



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

}

function mostrarSpiner(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    const spiner = document.createElement('div');
    spiner.classList.add('spinner');

    spiner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spiner);

    setTimeout( () => {

    }, 3000)
}
