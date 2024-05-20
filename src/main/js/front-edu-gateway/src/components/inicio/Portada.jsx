import './portada.css'

export default function Portada({nombre, img_path}){
    return(
        <div className={"portada"}>
            <h1 style={{fontSize:'4rem'}}>HOLA<br/>{nombre.toUpperCase()}</h1>
            <img src={img_path} alt="Imagen de portada"/>
        </div>
    )
}