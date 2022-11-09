import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ReactImageGalleryItem } from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ApiConstants } from '../../../helpers/api_constants';
import { BDValues } from '../../../helpers/bd_values';
import { RoutesConstants } from '../../../helpers/routes_constants';
import ButtonPrimary from '../../../shared/components/buttom_primary';
import ConfirmDialog from '../../../shared/components/confirm_dialog';
import HomeItems from '../../../shared/components/home_items';
import ImgsModal from '../../../shared/components/modal_imgs';
import PaymentModal from '../../../shared/components/payment_modal';
import { IHouseImageModel, IHouseSingleResponseModel } from '../../../shared/services/models/house_model';
import houseRepository from '../../../shared/services/repository/house_repository';
import Error from '../../shared/error/error';

const ManegerInfoHomePage = () => {

  const [images, setImages] = useState<ReactImageGalleryItem[]>([])
  const params = useParams()
  const navigation = useNavigate()
  const [houseResponse, setHouseResponse] = useState<IHouseSingleResponseModel>({} as IHouseSingleResponseModel)
  const [loading, setLoading] = useState(true)
  // const [infoLoading, setInfoLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [pageError, setPageError] = useState(false)
  const [showImgs, setShowImgs] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState({
    show: false,
    homeId: 0,
    paymentId: 0
  });


  useEffect(() => {

    let slug = params.slug

    if (slug && slug.length > 0)
      houseRepository
        .getBySlugForUser(slug as string)
        .then(response => {

          console.log(response.data.data)
          setHouseResponse(response.data.data)

          let images = populateImages(response.data.data?.images as IHouseImageModel[])

          setImages(images)


        })
        .catch(reject => {
          console.log(reject)
          setPageError(true);
        })
        .finally(() => {
          setLoading(false)
        })

  }, [])

  function handleRemove(id: number) {
    // alert(id)
    ConfirmDialog({
      title: 'Confirmar',
      message: 'Deseja apagar a casa?',
      onConfirm: () => {
        setRemoveLoading(true)
        houseRepository
          .deleteById(id)
          .then(Response => {

            toast.success('removido com sucesso!')
            setTimeout(() => {
              navigation(RoutesConstants.manage)
            }, 2000)
          })
          .catch(reject => {
            console.log(reject)
            if (reject.status === 0)
              toast.error('Erro de conexao!')
            toast.error('Erro ao remover')
          }).finally(() => {
            setRemoveLoading(false)
          })
      }
    })
  }

  function handleStatus(homeId: number, status: boolean) {
    // alert('ddd')
    ConfirmDialog({
      title: 'Confirmar',
      message: 'Deseja mudar o estado de bloqueio?',
      onConfirm: () => {
        setStatusLoading(true)
        houseRepository.updateStatus({ homeId: homeId, isBlocked: status })
          .then(Response => {

            setHouseResponse(old => ({ ...old, home: { ...old.home, isblocked: status } }))

            toast.success('actualizado com sucesso!')
          })
          .catch(reject => {
            if (reject.status === 0)
              toast.error('Erro de conexao!')
            toast.error('Erro ao actualizar')
          }).finally(() => {
            setStatusLoading(false)
          })
      }
    })
  }

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

  function handleShowSlide(status: boolean) {
    setShowImgs(status)
  }

  function closePaymentModal() {
    setShowPaymentModal(old => ({ ...old, show: false }))
  }
  function handlePaymentSucess(homeId?: number) {
    setHouseResponse(old => ({ ...old, home: { ...old.home, initialized: true, isExpired: null } }))
    closePaymentModal()
  }

  function handleShowPaymentModal(homeId: number, paymentId?: number, isUpdate: boolean = false) {
    if (isUpdate) {
      setShowPaymentModal(old => ({ ...old, homeId: homeId, paymentId: paymentId as number, show: true }))
    } else {
      setShowPaymentModal(old => ({ ...old, homeId: homeId, show: true }))
    }
  }

  function handlePaymentOnHide() {
    closePaymentModal()
  }

  if (loading)
    return <>loading...</>

  if (pageError)
    return <Error />


  return (
    <div className="container">

      <ToastContainer />

      {/* {infoLoading && <Loading />} */}

      <ImgsModal
        show={showImgs}
        images={images}
        onHide={() => handleShowSlide(false)}
        handleFullScreen={handleFullScreen}
      />

      <PaymentModal
        onSuccess={handlePaymentSucess}
        homeId={showPaymentModal.homeId}
        paymentId={showPaymentModal.paymentId}
        show={showPaymentModal.show}
        close={closePaymentModal}
        onHide={() => handlePaymentOnHide()}
        normalCancel
        update={houseResponse.home.initialized}
      />

      <div className="">
        <nav aria-label="breadcrumb ">
          <ol className="breadcrumb tex-end">
            <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">gerir</li>
            <li className="breadcrumb-item"><Link to={RoutesConstants.manage}>Anunciadas</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{houseResponse.home.title}</li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-between">
        <div className="">
          <button onClick={() => handleShowSlide(true)} className='btn btn-outline-success rounded-0'>
            <FontAwesomeIcon icon={faPhotoFilm} />
            <span className='ms-2'>
              ver fotos
            </span>
          </button>
        </div>

        <div className="d-flex justify-content-end mb-2">
          {
            houseResponse.home.isExpired ?
              <button onClick={() => handleShowPaymentModal(houseResponse.home.id as number, houseResponse.home.payment_id as number, true)} className='btn btn-sm btn-outline-warning rounded-0 mx-2'>Re-activar</button>
              : houseResponse.home.initialized
                ?
                <ButtonPrimary text={houseResponse.home.isblocked ? 'Desbloquear' : 'Bloquear'} isLoading={statusLoading} onPress={() => handleStatus(houseResponse.home.id as number, !houseResponse.home.isblocked)} />
                :
                <button onClick={() => handleShowPaymentModal(houseResponse.home.id as number,)} className='btn btn-sm btn-outline-success rounded-0 mx-2'>Anunciar</button>
          }
          <div className=" d-inline ms-2">
            <ButtonPrimary text='Remover' color={'danger'} isLoading={removeLoading} onPress={() => handleRemove(houseResponse.home.id as number)} />
          </div>
        </div>

      </div>
      <div className="">
        <HomeItems label='Cidade' value={houseResponse.home.city as string} />
        <HomeItems label='Bairo' value={houseResponse.home.bairo as string} />
        <HomeItems label='Rua' value={houseResponse.home.rua as string} />
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
    </div>
  )
}

export default ManegerInfoHomePage