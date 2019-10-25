// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import unwrapLiveConfig from '@ledgerhq/live-common/lib/hw/unwrapLiveConfig'

type Input = {
  devicePath: string,
  wrappedConfig: string,
}

type Result = string

const cmd: Command<Input, Result> = createCommand(
  'unwrapLiveConfig',
  ({ devicePath, wrappedConfig }) =>
    withDevice(devicePath)(transport => from(unwrapLiveConfig(transport, wrappedConfig))),
)

export default cmd
