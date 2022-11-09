import { useEffect, useState } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { Link, useParams } from 'react-router-dom';
import { ApiConstants } from '../../../helpers/api_constants';
import { BDValues } from '../../../helpers/bd_values';
import { RoutesConstants } from '../../../helpers/routes_constants';
import HomeItems from '../../../shared/components/home_items';
import { IHouseImageModel, IHouseSingleResponseModel } from '../../../shared/services/models/house_model';
import houseRepository from '../../../shared/services/repository/house_repository';
import Error from '../../shared/error/error';
import './index.css';



const HomeDetailsPage = () => {

  const [images, setImages] = useState<ReactImageGalleryItem[]>([])
  const params = useParams()
  const [houseResponse, setHouseResponse] = useState<IHouseSingleResponseModel>({} as IHouseSingleResponseModel)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState(false)



  useEffect(() => {

    let slug = params.slug

    if (slug && slug.length > 0)
      houseRepository
        .getBySlug(slug as string)
        .then(response => {

          console.log(response)
          setHouseResponse(response.data.data)

          let images = populateImages(response.data.data?.images as IHouseImageModel[])

          setImages(images)


        })
        .catch(reject => {
          alert('erro ao ler a casa')
          setPageError(true);
        })
        .finally(() => {
          setLoading(false)
        })

  }, [])

  function populateImages(imagesModel: IHouseImageModel[], isFullScreen = false) {

    const imagesI: ReactImageGalleryItem[] = imagesModel.map(e => {
      return ({
        original: ApiConstants.baseUrlFiles + e.url,
        // thumbnail: 'http://localhost:8000/storage/homes/cab2023ac1de32b5033c6e28a2fc1a91.jpg',
        thumbnailHeight: 50,
        thumbnailWidth: 50,
        originalClass: isFullScreen ? 'slide-img-full-screen' : 'slide-img'
      })
    })

    return imagesI

  }

  function handleFullScreen(e: boolean) {
    let images = houseResponse.images
    let newImages = populateImages(images, e)
    setImages(newImages)
  }

  if (loading)
    return <>loading...</>

  if (pageError)
    return <Error />

  return (
    <div className="">

      <div className="container px-3 pt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Aluguel</li>
            <li className="breadcrumb-item"><Link to={RoutesConstants.homeSearch}>Descobrir</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{houseResponse.home.title}</li>
          </ol>
        </nav>
      </div>

      <div className="container">

        <div className='slide-galery'>
          <ImageGallery
            items={images}
            autoPlay={false}
            showThumbnails={false}
            thumbnailPosition={'bottom'}
            onScreenChange={(e) => handleFullScreen(e)}
          />
        </div>

        <div className="home-information my-3">

          {/* <!-- Nav tabs --> */}
          <ul className="nav nav-tabs nav-fill bg-dark" id="nav-tab" role="tablist">

            <li className="nav-item " role="presentation">
              <button className="nav-link active rounded-0 w-100" id="home-data-tab" data-bs-toggle="tab" data-bs-target="#home">Dados da casa</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link rounded-0 w-100" id="nav-description" data-bs-toggle="tab" data-bs-target="#description">Descrição</button>
            </li>
            <li className="nav-item " role="presentation">
              <button className="nav-link rounded-0 w-100" id="nav-uer-tab" data-bs-toggle="tab" data-bs-target="#user">Usuário</button>
            </li>
            <li className="nav-item " role="presentation">
              <button className="nav-link rounded-0 w-100" id="nav-map-tab" data-bs-toggle="tab" data-bs-target="#map">Localização & Mapa</button>
            </li>
          </ul>
          {/* <!-- Tab panes --> */}
          <div className="tab-content px-4 py-3" id="tabContent">

            <div className="tab-pane show active" id="home" role="tabpanel" aria-labelledby="nav-home-data-tab">
              <HomeItems label='Preço' value={String(houseResponse.home.price + ',00 MZN')} />
              <HomeItems label='Numero de quartos' value={String(houseResponse.home.badroom)} />
              <HomeItems label='Numero de salas' value={String(houseResponse.home.sala)} />
              <HomeItems label='Numero de varandas' value={String(houseResponse.home.varanda)} />
              <HomeItems label='Numero de cozinhas' value={String(houseResponse.home.cozinha)} />
              <HomeItems label='Uso da cozinha' value={BDValues.getNamedCozinhaShared(houseResponse.home.cozinha_shared as number)} />
              <HomeItems label='Localização da cozinha' value={BDValues.getNamedCozinhaInside(houseResponse.home.cozinha_inside as number)} />
              <HomeItems label='Numero de banheiros' value={String(houseResponse.home.bafroom)} />
              <HomeItems label='Localização do banheiro' value={BDValues.getNamedBafroomInside(houseResponse.home.bafroom_inside as number)} />
              <HomeItems label='Uso do banheiro' value={BDValues.getNamedBafroomShared(houseResponse.home.bafroom_shared as number)} />
              <HomeItems label='Dimensão média' value={String(houseResponse.home.dimention + ' m2')} />
            </div>
            <div className="tab-pane" id="description" role="tabpanel" aria-labelledby="nav-description-tab">
              {houseResponse.home.description}
            </div>
            <div className="tab-pane" id="user" role="tabpanel" aria-labelledby="nav-user-tab">
              <HomeItems label='Nome' value={houseResponse.home.user as string} />
              <HomeItems label='Email' value={houseResponse.home.email as string} />
              <HomeItems label='Contactos' value={(houseResponse.home.phone_number as string) + (houseResponse.home.phone_number_2 ? ' / ' + (houseResponse.home.phone_number_2 as string): '')} />
            </div>
            <div className="tab-pane" id="map" role="tabpanel" aria-labelledby="nav-map-tab">
              <HomeItems label='Cidade' value={houseResponse.home.city as string} />
              <HomeItems label='Bairo' value={houseResponse.home.bairo as string} />
              <HomeItems label='Rua' value={houseResponse.home.rua as string} />
              mapa
            </div>
          </div>

        </div>

      </div>
    </div>


  )
}

export default HomeDetailsPage