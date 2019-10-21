// @flow

import { createCommand, Command } from 'helpers/ipc'
import requireApp from '@ledgerhq/live-common/lib/hw/requireCurrencyApp'
import { findCryptoCurrency } from '@ledgerhq/live-common/lib/currencies'

export const getCurrencyByKeyword = (keyword: string) => {
  const r = findCryptoCurrency(c => {
    const search = keyword.replace(/ /, '').toLowerCase()
    return (
      c.id === search ||
      c.name.replace(/ /, '').toLowerCase() === search ||
      (c.managerAppName && c.managerAppName.replace(/ /, '').toLowerCase() === search) ||
      c.ticker.toLowerCase() === search
    )
  })
  if (!r) {
    throw new Error(`currency '${keyword}' not found`)
  }
  return r
}

type Input = {
  devicePath?: string,
  name: string,
}

const cmd: Command<Input, *> = createCommand('requireApp', ({ devicePath, name }) =>
  requireApp(getCurrencyByKeyword(name), devicePath || ''),
)

export default cmd
