import { faLocationDot, faPhone, faStar, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiConstants } from '../../../helpers/api_constants'
import { RoutesConstants } from '../../../helpers/routes_constants'
import { useAuth } from '../../hooks/auth_hook'
import { IHouseModel } from '../../services/models/house_model'
import favoritRepository from '../../services/repository/favorits_repository'
import ImgLoading from '../img_loading/inde'
import './index.css'

interface ICardHomeProps {
    house: IHouseModel,
    hanldeOnFavoritChange: (id: number, newStatus: number | null) => void
}

const CardHome: React.FC<ICardHomeProps> = ({ house, hanldeOnFavoritChange }) => {

    const {auth} = useAuth()
    const [imgLoading, setImgLoading] = useState(true)
    const [favoritLoading, setFavoritLoading] = useState(false)


    function handleFavorit() {

        setFavoritLoading(true)

        favoritRepository
            .update({ home_id: house.id as number })
            .then(response => {
                let newStatus = house.isFavorit === 1 ? null : 1
                hanldeOnFavoritChange(house.id as number, newStatus)
            })
            .catch()
            .finally(() => {
                setFavoritLoading(false)
            })
    }


    return (
        <div className="card shadow-sm border-0 rounded-0 me-md-2 mb-3">

            {
                imgLoading &&
                <div className="img-loading">
                    <ImgLoading />
                </div>
            }
            <img src={ApiConstants.baseUrlFiles + house.url} hidden={imgLoading} loading='eager' className="card-img-top rounded-0" alt="..." onLoad={() => setImgLoading(false)} onError={() => 1} />

            <div className="card-body">
                <h6 className="card-title mb-1">MZN {house.price},00/mês</h6>
                <div>
                    <p className="card-text my-0 text-muted text-small">
                        <FontAwesomeIcon icon={faLocationDot} className='me-2' />
                        {house.city} . {house.bairo} . {house.rua}
                    </p>
                    <p className="card-text text-muted">{house.badroom} quarto. {house.sala} sala . {house.varanda} varanda . {house.cozinha} cozinha . {house.bafroom} banheiro</p>
                    <p className="card-text text-muted"></p>
                    <div className="d-flex justify-content-between">
                        {
                            auth?.user ?
                                favoritLoading
                                    ?
                                    <div className='p-2 d-flex justify-content-center align-items-center'>
                                        <div className="spinner-border spinner-border-sm text-success" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    : <button onClick={() => handleFavorit()} className='btn-favorits rounded-pill p-2 d-flex justify-content-center align-items-center'>
                                        {
                                            house.isFavorit ?
                                                <FontAwesomeIcon icon={faStar} className='text-warning' />
                                                :
                                                <FontAwesomeIcon icon={faStar} className='text-muted' />
                                        }
                                    </button>
                                :
                                <div></div>
                        }

                        <Link to={RoutesConstants.homeDetails + house.slug} className="btn btn-sm rounded-0 btn-outline-success">ver mais...</Link>
                    </div>
                </div>
            </div>
            <div className="card-footer d-flex flex-wrap bg-transparent border-success">
                <div className="text-small me-3 rounded-pill">
                    <FontAwesomeIcon icon={faUser} className='me-2' />
                    <span>{house.user}</span>
                </div>
                <div className="text-small rounded-pill">
                    <FontAwesomeIcon icon={faPhone} className='me-1' />
                    <span>{house.phone_number}</span>
                </div>
            </div>
        </div>
    )
}



export default CardHome