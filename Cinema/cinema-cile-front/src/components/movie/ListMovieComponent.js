import React, {useState, useEffect, useCallback} from 'react'
import { useLocation } from 'react-router-dom';
import MovieService from '../../services/MovieService';
import CreateMovieModalComponent from './CreateMovieModalComponent';
import { Modal, Button } from 'react-bootstrap';
import './ListMovieComponent.css';
import './CreateMovieModalComponent.css';
import EditMovieModalComponent from './EditMovieModalComponent';
import { Link } from 'react-router-dom';
import AlertService from '../../alert/AlertService';
import Swal from 'sweetalert2';
import { create } from 'xmlbuilder2';

const ListMovieComponent = () => {
    const [movies, setMovies] = useState([]);
    const [xmlOutput, setXmlOutput] = useState('');
    const formData = new FormData();
    const location = useLocation();
    console.log('location', location);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [director, setDirector] = useState('');
    const [actors, setActors] = useState('');
    const [distributor, setDistributor] = useState('');
    const [year, setYear] = useState(1);
    const [duration, setDuration] = useState(1);
    const [genre, setGenre] = useState('Sci-fi');
    const [description, setDescription] = useState('');
    
    const [selectedFile, setSelectedFile] = useState(undefined);

    const movie = {id, name, description, director, genre, actors, distributor, year, duration, setDescription, setName, setGenre, setDirector, setActors, setDistributor, setYear, setDuration }
    const file = {selectedFile, setSelectedFile};
    const genres = ["Sci-fi", "Action", "Thriller", "Drama", "Mystery", "Comedy" , "Horror"];

    useEffect(() => {
      getAllMovies();
    }, [])
    
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleConvert = useCallback(() => {
        try {
            console.log(movies);
            const jsonObj = {root: { movies: movies }};
    console.log('jsonObj',jsonObj);
            const xml = create({ version: '1.0' }).ele(jsonObj).end({ prettyPrint: true });
            console.log(xml);
            setXmlOutput(xml);
        } catch (error) {
            console.error('Invalid JSON input', error);
            alert('Invalid JSON input');
        }
    }, [movies]);

    const handleDownload = () => {
        const blob = new Blob([xmlOutput], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filme.xml';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShowCreateMovieModal = () =>{
        setShowModal(true);
        // setId(null);
    }

    const handleCloseCreateMovieModal = () =>{
        setShowModal(false);
        setActors('');
        setDirector('');
        setDistributor('');
        setName('');
        setDuration(1);
        setDescription('');
        setYear(1);
    }

    const handleShowEditMovieModal = (movie) =>{
        setShowEditModal(true);
        setId(movie.id);
        setActors(movie.actors);
        setDirector(movie.director);
        setDistributor(movie.distributor);
        setName(movie.name);
        setDuration(movie.duration);
        setDescription(movie.description);
        setYear(movie.year);
        setGenre(movie.genre);
    }

    const handleCloseEditMovieModal = () =>{
        setShowEditModal(false);
        setId(null);
        setActors('');
        setDirector('');
        setDistributor('');
        setName('');
        setDuration(1);
        setDescription('');
        setYear(1);
    
    }

    const handleSubmitEdit = () =>{
        MovieService.updateMovie(movie).then((response) =>{
            let responseFromServer = response.data.toString();
            if(responseFromServer == "success"){
                alert("schimbat cu succes");
                handleCloseEditMovieModal();
                getAllMovies();
            }
            else if(responseFromServer == "invalid"){
                alert("Invalid input");
            }
        })
    }

    const handleSubmit = () =>{
        if(selectedFile != null && selectedFile!=undefined) {
            formData.append('image', selectedFile);
            formData.append('movie', JSON.stringify(movie));
        }
        else{
            formData.append('image', '');
            formData.append('movie', JSON.stringify(movie));
        }
        MovieService.createMovie(formData).then((response) =>{
            let responseFromServer = response.data.toString();
            if(responseFromServer == "valid"){
                alert("adaugat cu succes");
                handleCloseCreateMovieModal();
                getAllMovies();
            }
        })
    }

    const getAllMovies = () => {
        MovieService.getAllMovies()
            .then((response) => {
                setMovies(response.data);
            })
            .catch((error) => {
                alert('You do not have the permissions to access this resource.')
            });
    };

    const alertAreYouSureDelete = (id) =>{
        Swal.fire({
          title: 'Are you sure?',
          text: "If you click yes, movie will be deleted!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            deleteMovie(id);
            Swal.fire(
              'Deleted!',
              'Movie has been deleted.',
              'success'
            )
          }
        })
      }

      const deleteMovie = (id) =>{
        MovieService.deleteMovie(id).then((response) =>{
            let responseFromServer = response.data.toString();
            if(responseFromServer == "success"){
                alert("film sters cu succes");
                getAllMovies();
            }
        })
      }
    

  return (
    <>
    
    <div className='container'>
        {location.pathname === '/movies' && (
        <button className='createMovieBtn' onClick={handleShowCreateMovieModal}>Create new movie</button>
            )}
        <h1 className='h1-movies'>Movies</h1>
        <h2>JSON to XML Section</h2>
        <h3>Movies as <b>JSON</b></h3>
        {movies?.length > 0 && (<textarea
            value={JSON.stringify(movies, null, 4)}
            placeholder="Enter JSON here"
            readOnly={true}
            disabled={true}
            rows={20}
            cols={100}
        />)}
        <div>
            <button onClick={handleConvert} type={"button"}>Convert to XML</button>
        </div>
        <div>
            <button onClick={handleDownload} type={"button"}>Download XML</button>
        </div>
        <h3>Movies as <b>XML</b></h3>
       <textarea
            value={xmlOutput}
            placeholder="XML Converted here"
            readOnly={true}
            disabled={true}
            rows={20}
            cols={100}
        />
        <div className='movie-main-container'>
            {
                movies.map((movie) =>{
                    return(
                    <div className='layer-container'>
                        <div className='movie-item-container' key={movie.id}>
                            <div className='movie-image-container'>
                                <img className='movie-image' src={"data:image/png;base64," + movie.image} alt=''></img> 
                            </div>
                            <div className='movie-info-container'>
                                <div className='container-box-1'>
                                    <label>ID: {movie.id}</label>
                                    <label>Name: {movie.name}</label>
                                    <label>Actors: {movie.actors}</label>
                                    <label>Distributor: {movie.distributor}</label>
                                    <label>Duration: {movie.duration} mins</label>
                                </div>
                                <div className='container-box-2'>
                                    <label>Year: {movie.year}</label>
                                    <label>Director: {movie.director}</label>
                                    <label>Genre: {movie.genre}</label>
                                    <label className='descriptionLabel'>Description: {movie.description}</label>
                                </div>
                            </div>
                            {location.pathname === '/movies' && (
                            <div className='movie-action-container'>
                                <label className='actionLabel'>Action</label>
                                <div className='action-fa-container'>
                                    <i id="fa-trash" class="fa fa-trash" onClick={() => alertAreYouSureDelete(movie.id)} aria-hidden="true"></i>
                                    <i id="fa-pencil" class="fa fa-pencil" onClick={() => handleShowEditMovieModal(movie)} aria-hidden="true"></i>
                                </div>
                            </div>)}
                        </div>
                    </div>
                    )
                })
            }
        </div>
        
    </div>
    {/* CREATE MOVIE  */}
    <Modal size='lg' className='modal' show={showModal} onHide={handleCloseCreateMovieModal}>
    <Modal.Header closeButton>
        <Modal.Title className='modal-title'>Create new movie</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <CreateMovieModalComponent movie={movie} file={file} genres={genres}/>
    </Modal.Body>

    <Modal.Footer>
        <button id="closeModalBtn" onClick={handleCloseCreateMovieModal}>Close</button>
        <button id="submitModalBtn" onClick={handleSubmit}>Submit</button>
    </Modal.Footer>
    </Modal>

    {/* EDIT MOVIE  */}
    <Modal size='lg' className='modal' show={showEditModal} onHide={handleCloseEditMovieModal}>
    <Modal.Header closeButton>
        <Modal.Title className='modal-title'>Edit movie</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <EditMovieModalComponent movie={movie} genres={genres}/>
    </Modal.Body>

    <Modal.Footer>
        <button id="closeModalBtn" onClick={handleCloseEditMovieModal}>Close</button>
        <button id="submitModalBtn" onClick={handleSubmitEdit}>Submit</button>
    </Modal.Footer>
    </Modal> 
    </>
  )
}

export default ListMovieComponent;