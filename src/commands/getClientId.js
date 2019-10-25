// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import getClientId from '@ledgerhq/live-common/lib/hw/getClientId'

type Input = {
  devicePath: string,
}

type Result = string

const cmd: Command<Input, Result> = createCommand('getClientId', ({ devicePath }) =>
  withDevice(devicePath)(transport => from(getClientId(transport))),
)

export default cmd
