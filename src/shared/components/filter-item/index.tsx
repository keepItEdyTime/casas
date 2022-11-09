import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHouseFliters } from '../../hooks/house_filters_hooks'
import ButtonMany from '../buttons_many'
import LoadingSpinner from '../laonding_spinner'



const FilterItem = () => {

  const filters = useHouseFliters()

  function disableWithOne(value: number, fields: number[]) {
    return value === 1 ? [...fields] : []
  }

  function disableWithAll(value: number, fieldZ: number[], fieldO: number[], fieldA: number[]) {
    if (value === 1) {
      return [...fieldZ]
    } else if (value === 2) {
      return [...fieldO]
    } else if (value > 1) {
      return [...fieldA]
    } else {
      return []
    }
  }

  return (
    <div className="p-3 bg-secondary">
      <div className="row">
        <div className="col-4 d-flex align-items-center text-white fw-bold">
          <FontAwesomeIcon icon={faFilter} />
          <span>Filtros</span>
        </div>
        <div className="col-8 text-end">
          <button onClick={filters.reset} className='btn btn-sm btn-danger rounded-0'>Limpar</button>
          <button onClick={filters.submit} className='btn btn-sm btn-warning rounded-0'>Aplicar</button>
        </div>
      </div>
      {/* ipunts */}

      <div className="element">
        <label htmlFor='max-price' className='label-form'>Pesquisa</label>
        <input type={'text'} value={filters.search} onChange={(e) => filters.setSearch(e.target.value)} placeholder={'Rua, descrição, titulo...'} className={'input-form'} />
      </div>
      {/* end-search input */}

      <div className="mb-3">
        <label htmlFor="city" className="label-form">Cidade</label>
        <select required value={filters.cityId} onChange={e => filters.setCity(Number(e.target.value))} id="city" className="input-form rounded-0" >
          <option value={-1} className='text-muted'>ecolha uma...</option>
          {
            filters.cities.map(city => {
              return <option key={city.id} value={city.id} unselectable="on" className="text-secondary" >{city.name}</option>
            })
          }
        </select>
        <span className="text-danger"></span>
      </div>
      {/* end cidade */}

      <div className="mb-3">
        <div className="d-flex">
          <div className="flex-grow-1">
            <label htmlFor="bairo" className="label-form">Bairo</label>
            <select required value={filters.bairoId} onChange={e => filters.setBairo(Number(e.target.value))} disabled={filters.bairoLoanding} id="bairo" className="input-form rounded-0" >
              <option value={-1} unselectable="on" className="text-secondary" >Todos</option>
              {
                filters.bairos.map(bairo => {
                  return <option key={bairo.id} value={bairo.id} unselectable="on" className="text-secondary" >{bairo.name}</option>
                })
              }
            </select>
          </div>
          {
            filters.bairoLoanding &&
            <div className="d-flex align-items-end ms-1 mb-2">
              <LoadingSpinner isSmall />
            </div>
          }
        </div>
        <span className="text-danger"></span>
      </div>
      {/* end bairos */}

      <div className="element">
        <div className="row">
          <div className="col-6">
            <label htmlFor='min-price' className='label-form'>Preco minimo</label>
            <input type={'number'} value={filters.minPrice} onChange={(e) => filters.setMinPrice(Number(e.target.value))} placeholder={'500'} className={'input-form'} />
          </div>
          <div className="col-6">
            <label htmlFor='max-price' className='label-form'>Preco maximo</label>
            <input type={'number'} value={filters.maxPrice} onChange={(e) => filters.setMaxPrice(Number(e.target.value))} id='max-price' placeholder={'ilimitado'} className={'input-form'} />
          </div>
        </div>
      </div>
      {/* end-prices */}

      <div className='element'>
        <div className='label-form mb-2'>Quartos</div>
        <ButtonMany elements={filters.badrooms} setActive={filters.setBadrooms} />
      </div>
      {/* end badrooms */}

      <div className='element'>
        <div className='label-form mb-2'>salas</div>
        <ButtonMany elements={filters.salas} setActive={filters.setSalas} />
      </div>
      {/* end salas */}

      <div className='element'>
        <div className='label-form mb-2'>varandas</div>
        <ButtonMany elements={filters.varandas} setActive={filters.setVarandas} />
      </div>
      {/* end salas */}

      <div className='element'>
        <div className='label-form mb-2'>Cozinhas</div>
        <ButtonMany elements={filters.cozinhas} setActive={filters.setCozinhas} />
      </div>
      {/* end cozinhas */}

      <div className='element'>
        <div className='label-form mb-2'>Localização da cozinha</div>
        <ButtonMany
          elements={filters.cozinhaInside}
          setActive={filters.setCozinhaInside}
          disableds={disableWithAll(filters.cozinhas.active as number, [0, 1, 2, 3], [3], [])}
        />
      </div>
      {/* end cozinhas */}

      <div className='element'>
        <div className='label-form mb-2'>uso da cozinha</div>
        <ButtonMany
          elements={filters.cozinhaShared}
          setActive={filters.setCozinhaShared}
          disableds={disableWithAll(filters.cozinhas.active as number, [0, 1, 2, 3], [3], [])}
        />
      </div>
      {/* end cozinhas */}

      <div className='element'>
        <div className='label-form mb-2'>Banheiros</div>
        <ButtonMany elements={filters.bafrooms} setActive={filters.setBafrooms} />
      </div>
      {/* end bafrooms */}

      <div className='element'>
        <div className='label-form mb-2'>Uso do banheiro</div>
        <ButtonMany
          elements={filters.bafroomsShared}
          setActive={filters.setbafroomsShared}
          disableds={disableWithOne(filters.bafrooms.active as number, [3])}
        />
      </div>
      {/* end badrooms shared */}

      <div className='element'>
        <div className='label-form mb-2'>Localização do Banheiro</div>
        <ButtonMany
          elements={filters.bafroomsInside}
          setActive={filters.setBafroomInside}
          disableds={disableWithOne(filters.bafrooms.active as number, [3])}
        />
      </div>
      {/* end badrooms inside */}

      <div className="element">
        <div className="row">
          <div className="col-6">
            <label htmlFor='min-area' className='label-form'>Area minima(m2)</label>
            <input type={'number'} value={filters.minDimention} onChange={(e) => filters.setMinDimention(Number(e.target.value))} min={0} max={50} placeholder={'2 m2'} className={'input-form'} />
          </div>
          <div className="col-6">
            <label htmlFor='max-area' className='label-form'>Area maxima(m2)</label>
            <input type={'number'} value={filters.maxDimention} onChange={(e) => filters.setMaxDimention(Number(e.target.value))} min={0} max={50} id='max-price' placeholder={'ilimitado'} className={'input-form'} />
          </div>
        </div>
      </div>
      {/* end-prices */}

    </div>
  )
}

export default FilterItem