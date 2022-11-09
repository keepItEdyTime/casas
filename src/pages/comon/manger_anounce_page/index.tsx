import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { BDValues } from '../../../helpers/bd_values'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ButtonMany from '../../../shared/components/buttons_many'
import ButtonPrimaryForm from '../../../shared/components/button_primary_form'
import LoadingSpinner from '../../../shared/components/laonding_spinner'
import PaymentModal from '../../../shared/components/payment_modal'
import TitleSecondary from '../../../shared/components/secondart_title'
import { IBairoModel } from '../../../shared/services/models/baito_model'
import { ICityModel } from '../../../shared/services/models/city_models'
import { IHouseBodyModel } from '../../../shared/services/models/house_model'
import bairoRepository from '../../../shared/services/repository/bairo_repository'
import cityRepository from '../../../shared/services/repository/city_repository'
import houseRepository from '../../../shared/services/repository/house_repository'
import './index.css'


const defaultValues = () => {
  return {
    title: '',
    images: undefined,
    price: 500,
    badroom: 1,
    sala: 0,
    varanda: 0,
    cozinha: 0,
    bafroom: 1,
    dimention: 2,
    city_id: 0,
    bairo_id: 0,
    rua: '',
    description: '',
    bafroom_shared: 0,
    bafroom_inside: 0,
    cozinha_shared: 0,
    cozinha_inside: 0,
    errors: undefined
  }
}

interface IInitValues {
  bairos: IBairoModel[],
  cities: ICityModel[]
}

const ManagerAnouncePage = () => {
  const [loading, setLoading] = useState(true)
  const [bairoLoanding, setBairoLoading] = useState(false)
  const [formLoanding, setFormLoading] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState({
    show: false,
    homeId: 0
  });

  const [selectedFiles, setSeletedFiles] = useState<string[]>([])
  const [inputs, setInputs] = useState<IHouseBodyModel>({} as IHouseBodyModel)
  const [initValues, setInitValues] = useState<IInitValues>({
    bairos: [],
    cities: []
  })

  function initialize() {
    let init = defaultValues();
    setInputs(old => (init))
    setSeletedFiles([])
  }

  useEffect(() => {

    initialize()
    console.log('hhh')
    cityRepository
      .getAll()
      .then(response => {

        let cities = response.data.data as ICityModel[];

        if (cities.length > 0) {

          setInitValues(old => ({
            ...old,
            cities: cities,
          }))

          return cities[0].id
        }

      }).catch(reject => {

        alert('erro ao ler as cidades')

      }).finally(() => {

        if (loading)
          setLoading(false)
      })

  }, [])


  function getBairos(cityId: number) {
    setBairoLoading(true)
    return bairoRepository
      .getByCity(cityId)
      .then(response => {

        let bairos = response.data.data as IBairoModel[]

        setInitValues(old => ({
          ...old,
          bairos: bairos,
        }))
      })
      .catch(reject => {
        console.log(reject)
        alert('erro ao ler os bairos')
      })
      .finally(() => {
        setBairoLoading(false)
      })
  }

  function setbafroom(value: number) {
    if (value <= 1) {
      setInputs(old => ({ ...old, bafroom: value, bafroom_shared: 0, bafroom_inside: 0 }))
    } else {
      setInputs(old => ({ ...old, bafroom: value }))
    }
  }

  function setbafroomShared(index: number) {
    setInputs(old => ({ ...old, bafroom_shared: index }))
  }
  function setBafroomInside(index: number) {
    setInputs(old => ({ ...old, bafroom_inside: index }))
  }

  function setCozinha(value: number) {

    let currentIniside = inputs.cozinha_inside
    let currentShared = inputs.cozinha_shared

    if (value <= 0) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_shared: 0, cozinha_inside: 0 }))
    } else if (value === 1 && (currentIniside === 3 || currentIniside === 0) && (currentShared === 3 || currentShared === 0)) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_shared: 1, cozinha_inside: 1 }))
    } else if (value === 1 && (currentIniside === 3 || currentIniside === 0)) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_inside: 1 }))
    } else if (value === 1 && (currentShared === 3 || currentShared === 0)) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_shared: 1 }))
    } else if (value > 1 && currentIniside === 0 && currentShared === 0) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_shared: 1, cozinha_inside: 1 }))
    } else if (value > 1 && currentIniside === 0) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_inside: 1 }))
    } else if (value > 1 && currentShared === 0) {
      setInputs(old => ({ ...old, cozinha: value, cozinha_shared: 1, }))
    } else {
      setInputs(old => ({ ...old, cozinha: value }))
    }
  }

  function setCozinhaShared(index: number) {
    setInputs(old => ({ ...old, cozinha_shared: index }))
  }

  function setCozinhaInside(index: number) {
    setInputs(old => ({ ...old, cozinha_inside: index }))
  }

  async function setCity(index: number) {
    setInputs(old => ({ ...old, city_id: index }))
    if (index !== 0) {
      await getBairos(index)
    } else {
      setInitValues(old => ({ ...old, bairos: [] }))
    }
  }

  function disableWithOne(value: number, fields: number[]) {
    return value === 1 ? [...fields] : []
  }

  function disableWithAll(value: number, fieldZ: number[], fieldO: number[], fieldA: number[]) {
    if (value === 0) {
      return [...fieldZ]
    } else if (value === 1) {
      return [...fieldO]
    } else if (value > 1) {
      return [...fieldA]
    } else {
      return []
    }
  }



  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const filesUrl = Array.from(event.target.files).map(file => URL.createObjectURL(file))
      setSeletedFiles(old => filesUrl)
      //Array.from(filesUrl).map(file => URL.revokeObjectURL(file))
      setInputs(old => ({ ...old, images: event.target.files as FileList }))
    }
    //setErrors(old => ({ ...old, image: '' }))
    console.log(selectedFiles)
  }

  function renderImages(path: string[]) {
    return path.map((imgsrc, index) => <img key={index} src={imgsrc} alt="" className="w-75" style={{ maxHeight: '120px' }} />)
  }


  //submit
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setFormLoading(true);
    let formData = new FormData()

    formData.append('title', inputs?.title as string)
    formData.append('price', String(inputs?.price))
    formData.append('sala', String(inputs?.sala))
    formData.append('varanda', String(inputs?.varanda))
    formData.append('rua', String(inputs?.rua))
    formData.append('description', String(inputs?.description))
    formData.append('badroom', String(inputs?.badroom))
    formData.append('bafroom', String(inputs?.bafroom))
    formData.append('bafroom_inside', String(inputs?.bafroom_inside))
    formData.append('bafroom_shared', String(inputs?.bafroom_shared))
    formData.append('cozinha', String(inputs?.cozinha))
    formData.append('cozinha_inside', String(inputs?.cozinha_inside as number - 1))
    formData.append('cozinha_shared', String(inputs?.cozinha_shared as number - 1))
    formData.append('dimention', String(inputs?.dimention))
    formData.append('bairo_id', String(inputs?.bairo_id))
    formData.append('city_id', String(inputs?.city_id))

    for (let i = 0; i <= 6; i++) {
      if (inputs?.images?.item(i))
        formData.append('image' + (i + 1), inputs?.images.item(i) as File)
    }
    console.log(formData.values())

    houseRepository
      .add(formData)
      .then(response => {
        toast.info('Faça o pagamento, para validar!')
        setShowPaymentModal(old => ({ ...old, homeId: response.data.data.home.id, show: true }))
      })
      .catch(response => {

        if (response.status === 0) {
          toast.error('Erro de Conexao')
        }

        if (response.status === 400) {
          setInputs(old => ({ ...old, errors: response.data.errors }))
          toast.error(response.data.message)
        }
        console.log(response)
      }).finally(() => {
        setFormLoading(false);
      })

  }

  function closePaymentModal(){
    setShowPaymentModal(old => ({ ...old, show: false }))
  }
  function handlePaymentSucess() {
    initialize()
    closePaymentModal()
  }
  function handlePaymentOnHide() {
    initialize()
      closePaymentModal()
  }


  if (loading)
    return <>loading</>

  return (
    <div className="mb-5 container">

      <ToastContainer />

      <PaymentModal
        onSuccess={handlePaymentSucess}
        homeId={showPaymentModal.homeId}
        show={showPaymentModal.show}
        close={closePaymentModal}
        onHide={() => handlePaymentOnHide()}
      />

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">gerenciador</li>
          <li className="breadcrumb-item active" aria-current="page">Anunciar casa</li>
        </ol>
      </nav>

      <TitleSecondary text='Anunciar uma casa' />

      <div className="">
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* onload */}
          {/* <fieldset disabled> */}
          <fieldset disabled={formLoanding} >

            <div className="row">


              <div className="col-md-8">

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Titulo</label>
                  <input required value={inputs.title} onChange={(e) => setInputs(old => ({ ...old, title: e.target.value }))} type="text" className="input-form rounded-0" id="title" />
                  <span className="text-danger">{inputs.errors?.title}</span>
                </div>
                {/* end title */}

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Preço(MZN)</label>
                  <input required type="number" value={inputs.price} onChange={(e) => setInputs(old => ({ ...old, price: Number(e.target.value) }))} min={500} className="input-form rounded-0" id="price" />
                  <span className="text-danger">{inputs.errors?.price}</span>
                </div>
                {/* end price */}

                <div className="mb-3">
                  <label htmlFor="badroom" className="form-label">Numero de quartos</label>
                  <input required type="number" value={inputs.badroom} onChange={(e) => setInputs(old => ({ ...old, badroom: Number(e.target.value) }))} min={1} max={20} className="input-form rounded-0" id="badroom" />
                  <span className="text-danger">{inputs.errors?.badroom}</span>
                </div>
                {/* end badroom */}

                <div className="mb-3">
                  <label htmlFor="sala" className="form-label">Numero de salas</label>
                  <input required type="number" value={inputs.sala} onChange={(e) => setInputs(old => ({ ...old, sala: Number(e.target.value) }))} min={0} max={20} className="input-form rounded-0" id="sala" />
                  <span className="text-danger">{inputs.errors?.sala}</span>
                </div>
                {/* end salas */}

                <div className="mb-3">
                  <label htmlFor="varanda" className="form-label">Numero de varandas</label>
                  <input required type="number" value={inputs.varanda} onChange={(e) => setInputs(old => ({ ...old, varanda: Number(e.target.value) }))} min={0} max={20} className="input-form rounded-0" id="varanda" />
                  <span className="text-danger">{inputs.errors?.varanda}</span>
                </div>
                {/* end varanda */}

                <div className="mb-3">
                  <label htmlFor="bafroom" className="form-label">Numero de banheiros</label>
                  <input required type="number" value={inputs.bafroom} onChange={(e) => setbafroom(Number(e.target.value))} min={1} max={20} className="input-form rounded-0" id="bafroom" />
                  <span className="text-danger">{inputs.errors?.bafroom}</span>
                </div>
                {/* end bafroom */}

                <div className="mb-3">
                  <label htmlFor="bafroom-inside" className="form-label">Localização do banheiro</label>
                  <ButtonMany
                    themeLight
                    elements={{ list: BDValues.bafroomInside, active: inputs.bafroom_inside as number }}
                    setActive={setBafroomInside}
                    disableds={disableWithOne(inputs.bafroom as number, [2])}
                  />
                  <span className="text-danger">{inputs.errors?.bafroom_inside}</span>
                </div>
                {/* end bafroom shared */}

                <div className="mb-3">
                  <label htmlFor="bafroom-shared" className="form-label">Uso do banheiro</label>
                  <ButtonMany
                    themeLight
                    elements={{ list: BDValues.bafroomShared, active: inputs.bafroom_shared as number }}
                    setActive={setbafroomShared}
                    disableds={disableWithOne(inputs.bafroom as number, [2])}
                  />
                  <span className="text-danger">{inputs.errors?.bafroom_shared}</span>
                </div>
                {/* end bafroom shared */}

                <div className="mb-3">
                  <label htmlFor="bafroom" className="form-label">Numero de cozinhas</label>
                  <input required type="number" value={inputs.cozinha} onChange={(e) => setCozinha(Number(e.target.value))} min={0} max={20} className="input-form rounded-0" id="bafroom" />
                  <span className="text-danger">{inputs.errors?.cozinha}</span>
                </div>
                {/* end cozinhas */}

                <div className="mb-3">
                  <label htmlFor="cozinha-inside" className="form-label">Localização da cozinha</label>
                  <ButtonMany
                    themeLight
                    elements={{ list: BDValues.cozinhaInside, active: inputs.cozinha_inside as number }}
                    setActive={setCozinhaInside}
                    disableds={disableWithAll(inputs.cozinha as number, [1, 2, 3], [0, 3], [0])}
                  />
                  <span className="text-danger">{inputs.errors?.cozinha_inside}</span>
                </div>
                {/* end cozinhas inside */}

                <div className="mb-3">
                  <label htmlFor="bafroom-shared" className="form-label">Uso da cozinha</label>
                  <ButtonMany
                    themeLight
                    elements={{ list: BDValues.cozinhaShared, active: inputs.cozinha_shared as number }}
                    setActive={setCozinhaShared}
                    disableds={disableWithAll(inputs.cozinha as number, [1, 2, 3], [0, 3], [0])}
                  />
                  <span className="text-danger">{inputs.errors?.cozinha_shared}</span>
                </div>
                {/* end cozinhas shared */}

                <div className="mb-3">
                  <label htmlFor="dimention" className="form-label">Dimensão média(m2)</label>
                  <input required type="number" value={inputs.dimention} onChange={(e) => setInputs(old => ({ ...old, dimention: Number(e.target.value) }))} min={2} max={50} className="input-form rounded-0" id="dimention" />
                  <span className="text-danger">{inputs.errors?.dimention}</span>
                </div>
                {/* end dimentions */}

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">Cidades</label>
                  <select required value={inputs.city_id} onChange={e => setCity(Number(e.target.value))} id="city" className="input-form rounded-0" >
                    <option value={0} className='text-muted'>cidade...</option>
                    {
                      initValues.cities.map(city => {
                        return <option key={city.id} value={city.id} unselectable="on" className="text-secondary" >{city.name}</option>
                      })
                    }
                  </select>
                  <span className="text-danger">{inputs.errors?.city_id}</span>
                </div>
                {/* end cidades */}

                <div className="mb-3">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <label htmlFor="bairo" className="form-label">Bairo</label>
                      <select required value={inputs.bairo_id} onChange={e => setInputs(old => ({ ...old, bairo_id: Number(e.target.value) }))} disabled={bairoLoanding} id="bairo" className="input-form rounded-0" >
                        <option value={0} className='text-muted'>bairo...</option>
                        {
                          initValues.bairos.map(bairo => {
                            return <option key={bairo.id} value={bairo.id} unselectable="on" className="text-secondary" >{bairo.name}</option>
                          })
                        }
                      </select>
                    </div>
                    {
                      bairoLoanding &&
                      <div className="p-2 d-flex ms-2 align-items-end justify-content-center">
                        <LoadingSpinner isSmall />
                      </div>
                    }
                  </div>
                  <span className="text-danger">{inputs.errors?.bairo_id}</span>
                </div>
                {/* end bairos */}

                <div className="mb-3">
                  <label htmlFor="rua" className="form-label">Rua</label>
                  <input value={inputs.rua} onChange={e => setInputs(old => ({ ...old, rua: e.target.value }))} className="input-form rounded-0" list="listRua" id="rua" placeholder="rua" />
                  <datalist id="listRua">
                    <option value="Lawely" />
                  </datalist><span className="text-danger">{inputs.errors?.rua}</span>
                </div>
                {/* end rua */}

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">descrição do produto</label>
                  <textarea required value={inputs.description} onChange={(e) => setInputs(old => ({ ...old, description: e.target.value }))} name="description" id="description" className="w-100 p-3 input-form" rows={10} ></textarea>
                  <span className="text-danger">{inputs.errors?.description}</span>
                </div>
                {/* end description */}

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Imagem</label>
                  <input required type="file" className="form-control rounded-0" id="image" onChange={handleImage} multiple max={6} maxLength={6} />
                  <span className="text-danger">

                    <ul>
                      {inputs.errors?.image1 && <li>{inputs.errors?.image1}</li>}
                      {inputs.errors?.image2 && <li>{inputs.errors?.image2}</li>}
                      {inputs.errors?.image3 && <li>{inputs.errors?.image3}</li>}
                      {inputs.errors?.image4 && <li>{inputs.errors?.image4}</li>}
                      {inputs.errors?.image5 && <li>{inputs.errors?.image5}</li>}
                      {inputs.errors?.image6 && <li>{inputs.errors?.image6}</li>}

                    </ul>

                  </span>
                </div>

                <ButtonPrimaryForm text="adicionar" isLoading={formLoanding} />

              </div>

              <div className="col-md-4">
                <div className=" h-100 border p-2 text-center d-flex flex-column justify-content-end align-items-center">
                  {renderImages(selectedFiles)}
                </div>
              </div>
            </div>
          </fieldset>
        </form>

      </div>
    </div>
  )
}

export default ManagerAnouncePage