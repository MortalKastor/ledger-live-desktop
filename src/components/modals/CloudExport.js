// @flow

import React, { PureComponent } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import axios from 'axios'
import querystring from 'query-string'

import getClientId from 'commands/getClientId'
import wrapLiveConfig from 'commands/wrapLiveConfig'
import unwrapLiveConfig from 'commands/unwrapLiveConfig'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'
import { activeAccountsSelector } from 'reducers/accounts'
import { exportSettingsSelector } from 'reducers/settings'
import { encode, decode } from '@ledgerhq/live-common/lib/cross'
import styled from 'styled-components'
import { addAccount } from 'actions/accounts'

import { MODAL_CLOUD_EXPORT } from 'config/constants'
import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import { closeModal } from '../../reducers/modals'

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: activeAccountsSelector,
  settings: exportSettingsSelector,
})
const mapDispatchToProps = {
  closeModal,
  addAccount,
}

const CloudContainer = styled.div`
  position: relative;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px ${props => props.theme.colors.palette.divider};
  background-color: ${p => p.theme.colors.white};
`

const Id = ({ value }: { value: string }) => <CloudContainer>{value}</CloudContainer>

class CloudExporter extends PureComponent<
  {
    accounts: Account[],
    settings: *,
    device: Device,
    closeModal: string => void,
    addAccount: *,
  },
  {
    id: string,
  },
> {
  constructor() {
    super()
    this.state = { id: '' }
  }

  getConfig = async () => {
    const { settings, device, addAccount } = this.props
    // const obj = {
    //   accounts,
    //   settings,
    //   exporterName: 'desktop',
    //   exporterVersion: __APP_VERSION__,
    // }

    //     const config = `Jessie : Nous sommes de retour
    // James : Pour vous jouer un mauvais tour
    // Jessie : Afin de préserver le monde de la dévastation
    // James : Afin de rallier tous les peuples à notre nation
    // Jessie : Afin d'écraser l'amour et la vérité
    // James : Afin d'étendre notre pouvoir jusqu'à la voie lactée
    // Jessie : Jessie !
    // James : James !
    // Jessie : La Team Rocket plus rapide que la lumière
    // James : Rendez-vous tous, ou ce sera la guerre
    // Miaouss : Miaouss, oui, la guerre !`
    // const config = encode(obj)

    const clientId = await getClientId.send({ devicePath: device.path }).toPromise()

    // await this.onGetId()

    // const wrappedConfig = await wrapLiveConfig.send({ devicePath: device.path, config }).toPromise()

    // const payload = {
    //   client_id: clientId,
    //   blob: wrappedConfig,
    // }

    // console.log(payload)

    // const postRes = await axios.post('http://f0d9d545.ngrok.io/', querystring.stringify(payload))

    // console.log(postRes)

    const getRes = await axios.get(`http://f0d9d545.ngrok.io/${clientId}`)

    const wrappedBlob = getRes.data.blob

    console.log(wrappedBlob)

    await this.onGetId()

    const unwrappedConfig = await unwrapLiveConfig
      .send({ devicePath: device.path, wrappedConfig: wrappedBlob })
      .toPromise()

    const decoded = decode(unwrappedConfig)

    console.log(decoded)

    for (const account of decoded.accounts) {
      console.log(account)
      addAccount(account)
    }
    // addAccounts(decoded.accounts)
  }

  onClose = () => this.props.closeModal(MODAL_CLOUD_EXPORT)

  onGetId = async () => {
    const { device } = this.props
    const id = await getClientId.send({ devicePath: device.path }).toPromise()
    this.setState({ id })
  }

  render() {
    const { id } = this.state
    return (
      <Modal name={MODAL_CLOUD_EXPORT} centered>
        <ModalBody
          onClose={this.onClose}
          title="KIKOU"
          render={() => (
            <>
              <Id value={id} />
              <Box horizontal>
                <Button onClick={this.onGetId} primary>
                  {'Get ID'}
                </Button>
                <Button onClick={this.getConfig} primary>
                  {'Get Config'}
                </Button>
              </Box>
            </>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button onClick={this.onClose} primary>
                {'👋'}
              </Button>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CloudExporter)
