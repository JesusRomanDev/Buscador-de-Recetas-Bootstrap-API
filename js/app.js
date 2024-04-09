document.addEventListener('DOMContentLoaded', iniciarApp);

function iniciarApp(){
    const selectCategorias = document.querySelector('#categorias');
    const resultado = document.querySelector('#resultado');
    const modal = new bootstrap.Modal('#modal'); //declaramos el modal de bootstrap con el ID que tenemos en el index
    //el new bootstrap.Modal viene del script que tenemos hasta abajo en el index, esto es para tener nuestras propias
    //instancias de ese Modal
    if(selectCategorias){ //#categorias solo existe en index, no en favoritos
        selectCategorias.addEventListener('change', seleccionarCategoria); //en este eventListener de categorias, en el html de 
        //favoritos, nos marcara error, nos dira que no puede leer las propiedades de null, eso es porque el id categorias
        //no existe en ese html, solo existe en el index, por eso se puso el IF si existe
        //Esto se debe a que si un elemento no existe todo nuestro codigo deja de funcionar, en este caso cuando nos vamos a la 
        //pestaña de favoritos
    }


    //Cargando el Select con Options con fetchAPI
    obtenerCategorias();

    function obtenerCategorias(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'; //en algunos casos de APIs se tiene que sacar un KEY,APIKEY, ETC
        fetch(url) //llamando a la URL

            .then(respuesta =>{
                return respuesta.json(); //entonces quiero una respuesta de tipo json
            })
            // .then(resultado =>{
            //     console.log(resultado); //entonces imprimeme esos resultados en consola
            // })
            .then( resultado => mostrarCategorias(resultado.categories));
    }

    function mostrarCategorias(categorias = []){ //parametro por default un arreglo
        console.log(categorias);
        //Vamos iterando sobre el array para ir generando las opciones de nuestro SELECT
        categorias.forEach(categoria =>{
            //{strCategory} = categoria; pudimos hacer destructuring
            const option = document.createElement('OPTION'); //creamos varios options abajo del select
            console.log(option);
            console.log(categoria);
            //Las options llevan value y su contenido, a diferencia de los input que estos su value es su contenido
            option.value = categoria.strCategory; //el valor de nuestra oprion sera lo que este en categoria.strCategory
            option.textContent = categoria.strCategory; //el contenido 
            selectCategorias.appendChild(option); //se inyecta en el HTML
        })

    }

    //AQUI NO HAY SUBMIT, POR LO TANTO EL ADDEVENTLISTENER ESCUCHO SOLO POR CHANGE Y NO ALGUN TIPO DE SUBMIT
    function seleccionarCategoria(e){
        console.log(e.target.value);
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}` //para hacer dinamica nuestra categoria

        fetch(url)
            .then(respuesta => respuesta.json())
            //.then(resultado => console.log(resultado)) nos muestra que hay X cantidad de recetas en el arreglo dependiendo lo que elegimos 
            .then(resultado => mostrarRecetas(resultado.meals))//accedemos a todas las meals
    }

    function mostrarRecetas(recetas = []){
        console.log(recetas);
        limpiarHTML(resultado);

        //Agregando un Heading
        const heading = document.createElement('h2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recetas.length ? 'Resultados' : 'No Hay Resultados'; //forma condicional
        //Si hay algo muestrame 'Resultados' si no 'No hay resultados'
        resultado.appendChild(heading);
        //Iterando en los resultados
        recetas.forEach(receta =>{
            console.log(receta);
            //Extrayendo de la receta
            const {idMeal, strMeal, strMealThumb} = receta;
            const recetaContenedor = document.createElement('div'); //este solamente sera el contenedor
            recetaContenedor.classList.add('col-md-4');

            const recetaCard = document.createElement('div');
            recetaCard.classList.add('card', 'mb-4');

            const recetaImagen = document.createElement('img');
            recetaImagen.classList.add('card-img-top')
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb;
            console.log(recetaImagen);

            const recetaCardBody = document.createElement('div');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('h3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal;

            const recetaBtn = document.createElement('button');
            recetaBtn.classList.add('btn', 'btn-danger', 'w-100');
            recetaBtn.textContent = 'Ver Receta';

            //Llamando al Model de Bootstrap (eso es para que al dar click nos muestre la siguiente accion)
            //recetaBtn.dataset.bsTarget = '#modal';
            //recetaBtn.dataset.bsToggle = 'modal'; //lo que hace es agregar/mandar llamar las funciones que estan en el archivo de JS de Bootstrap
            //De este modo, al momento de dar click a Ver Receta, ya se abrira el modal de Bootstrap

            //Quiero que al darle click me lo traiga para poder agregarlo a favoritos, para eso necesito el ID
            //Una vez que le presionemos mande llamar otra funcion que consulte la API que se traiga esa receta en especifico
            recetaBtn.onclick = function(){
                seleccionarReceta(idMeal); //al poner la function de esa manera, es como ponerlo como callback, estamos esperando
                //a ese evento, osease se ejecuta hasta que le demos click
                //Para mas info ir al proyecto de recetas en la clase "llamando el modal de bootstrap"
            }


            //Inyectar el HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaBtn);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);

        })
    }

    function seleccionarReceta(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
            .then(respuesta => respuesta.json())
            //.then(resultado => console.log(resultado.meals)) //nos arroja la respuesta como arreglo de objetos, para acceder a las
            //meals es resultado.meals[0]
            // .then(res => console.log(res.meals))
            .then(resultado => mostrarRecetaModal(resultado.meals[0]))
    }

    //Mostrando la receta en el HTML
    function mostrarRecetaModal(receta){
        console.log(receta); //Vemos que datos podemos extraer
        const {idMeal, strInstructions, strMeal, strMealThumb} = receta;

        //Accediendo al titulo y Body
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y Cantidades</h3>
        `
        const listGroup = document.createElement('ul'); //existen las ul y ol
        listGroup.classList.add('list-group');

        //Mostrar Cantidades e Ingredientes de lo que tiene nuestro parametro de Receta
        for(let i=1; i<=20; i++){
            if(receta[`strIngredient${i}`]){ //si el parametro de receta contiene tal
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];
                console.log(`${ingrediente} - ${cantidad}`);

                const ingredienteLi = document.createElement('li'); //este Li recordemos que siempre va detro de un UL/OL
                ingredienteLi.classList.add('list-group-item');
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredienteLi);
            }
        }
        modalBody.appendChild(listGroup);


        const modalFooter = document.querySelector('.modal-footer');
        //Limpiamos el HTML porque si no con el APPENDCHILD se nos generaria varias veces los botones y cerramos y abrimos otros
        limpiarHTML(modalFooter);
        //Botones de cerrar y favorito
        const btnFavorito = document.createElement('button');
        btnFavorito.classList.add('btn-danger', 'btn', 'col'); //la clase col nos hace repartir en mitades o partes iguales el espacio
        btnFavorito.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';
        //el textContent va a ser condicional, en dado caso de que no se haya agregado a favorito o si
        //Si ya existe entonces coloca el texto Eliminar Favorito, de otra manera ponle Guardar Favorito
        //esta funcion nos retornara un TRUE O FALSE ya que estamos usando el metodo SOME

        //Almacenar en LocalStorage
        btnFavorito.onclick = function(){
            //console.log(existeStorage(idMeal)); true o false si ya existe esa comida
            if(existeStorage(idMeal)){ //si esta funcion retorna TRUE.....
                eliminarFavorito(idMeal);
                //Para hacer mas dinamico el boton y no tener que cerrar y abrir para que se actualice el texto
                //Si se elimina de favorito entonces...
                btnFavorito.textContent ='Guardar Favorito';
                mostrarToast('Eliminado Correctamente');
                return //si existe ese mismo ID en el storage que ya no se ejecuten las lineas de abajo
            }
            //Le agregamos un Objeto que se pasara a LocalStorage
            agregarFavorito({
                id: idMeal,
                title: strMeal,
                img: strMealThumb
            });
            btnFavorito.textContent = 'Eliminar Favorito';
            mostrarToast('Agregado Correctamente');
        }

        const btnCerrarModal = document.createElement('button');
        btnCerrarModal.classList.add('btn-secondary', 'btn', 'col');
        btnCerrarModal.textContent = 'Cerrar';
        btnCerrarModal.onclick = function (){ //como tenemos la variable de Modal hasta arriba y el constructor de Bootsrap modal
            //podemos y tenemos acceso a esa funcion
            modal.hide();
            //ponemos asi la funcion porque si la ponemos asi 
            //btnCerrarModal.onclick = modal.hide(); estariamos mandando llamar esta funcion en automatico y el boton no funcionara
            //mejor con el callback para esperar a que ocurra ese evento
        }

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);

        //Muestra el Modal
        modal.show();
    }

    function agregarFavorito(receta){ //contruimos el objeto con el argumento dado
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? []; //puede ser que no exista ese getItem de favoritos,
        //entonces agregale un arreglo vacio
        //este operador se llama nullish coalescing, en caso de que la evaluacion del lado izquierdo marque null, aplique lo del
        //lado derecho
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
    }

    function eliminarFavorito(id){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    }

    function existeStorage(id){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        //some itera sobre todos los elementos del arreglo y retorna true si alguno cumple con la condicion
        return favoritos.some(favorito =>{
            return favorito.id === id;
        })
    }

    //Toast para mostrar una Alerta
    function mostrarToast(mensaje){
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);  //le pasamos el elemento donde queremos que se genere ese Toast
        toastBody.textContent = mensaje; //el mensaje que contendra
        toast.show();
    }

    function limpiarHTML(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }

}