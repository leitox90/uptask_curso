//VIDEO 53 y 54, 55 , 56. Lado Cliente
import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) { 
    btnEliminar.addEventListener('click', e => {
      const urlProyecto = e.target.dataset.proyectoUrl;
      
      // console.log(urlProyecto);

      Swal.fire({
          title: 'Desea borrar este proyecto?',
          text: "Un proyecto eliminado no se puede recuperar",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, borrar',
          cancelButtonText: 'Cancelar'
        }).then((result) => { 
          if (result.isConfirmed) {
            //Enviar Peticion a AXIOS. VID 54. LADO CLIENTE. Editado en VID 55
            const url = `${location.origin}/proyectos/${urlProyecto}`;

            axios.delete(url, {params: {urlProyecto}})
              .then(function(respuesta){
                console.log(respuesta)
                
                Swal.fire(
                  'Proyecto Eliminado',
                  //'El proyecto fue eliminado correctamente', Puedo cambiar esto por lo de abajo
                  respuesta.data,// Esto viene del controlador, desde el res.send
                  'success'
                );
                //redireccionar al inicio VID 53
                setTimeout(() => {
                    window.location.href = '/'
                }, 3000);
              })
              //manejo de errores. para testear esto lo que puedo hacer es en la base de datos editar la URL. VID 56
              .catch(() => {
                Swal.fire({
                  type:'error',
                  title: 'Hubo un error',
                  text: 'No se pudo eliminar el Proyecto'
                })
              })            
          }
        })
  })
}
export default btnEliminar;



