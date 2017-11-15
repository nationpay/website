'use strict'

import B from 'bluebird'

import Ru from 'rutils'

import getApi from './api'



let newRegistry = false


// console.log('crypto::: ', crypto);

const rejectIfError = Ru.curry( (fn, res ) => {

  console.log('resError::::', res);

  const go = Ru.pipe(
    JSON.parse,
    Ru.cond([
      [ Ru.o( Ru.isNotNil, Ru.path([ 'data', 'httpCode' ]) ),  r => B.reject( r.data ) ],
      [ Ru.T,  fn ]
    ])
  )

  return go(res)

})

const subscribe = email => {
  const api = getApi()

  return (
    api
    .put(`subscribers/${email}`, {})
    .then( rejectIfError( Ru.K(true)))
  )
}

const s = {
  subscribe
}

export default s
