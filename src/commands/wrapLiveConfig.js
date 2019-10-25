// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import wrapLiveConfig from '@ledgerhq/live-common/lib/hw/wrapLiveConfig'

type Input = {
  devicePath: string,
  config: string,
}

type Result = string

const cmd: Command<Input, Result> = createCommand('wrapLiveConfig', ({ devicePath, config }) =>
  withDevice(devicePath)(transport => from(wrapLiveConfig(transport, config))),
)

export default cmd
