// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import Box from 'components/base/Box'
import { compose } from 'redux'

import { connect } from 'react-redux'

import type { T } from 'types/common'

import { openModal } from 'reducers/modals'

import { SettingsSectionHeader as Header } from '../../SettingsSection'
import { EXPERIMENTAL_WS_EXPORT, MODAL_CLOUD_EXPORT } from '../../../../config/constants'
import IconShare from '../../../../icons/Share'
import Button from '../../../base/Button'
import SocketExport from '../../SocketExport'
import ExportOperationsBtn from '../../../ExportOperationsBtn'
import DownloadCloud from '../../../../icons/DownloadCloud'
import ExportAccountsModal from '../../ExportAccountsModal'

type Props = {
  t: T,
  openModal: (string, any) => void,
}

type State = {
  isModalOpened: boolean,
}

const mapDispatchToProps = {
  openModal,
}

// TODO refactor out the export accounts into its own file
class SectionExport extends PureComponent<Props, State> {
  state = {
    isModalOpened: false,
  }

  onModalOpen = () => {
    this.setState({ isModalOpened: true })
  }

  onModalClose = () => {
    this.setState({ isModalOpened: false })
  }

  onMiaouss = () => {
    console.log('miaouss')
    this.props.openModal(MODAL_CLOUD_EXPORT)
  }

  render() {
    const { t } = this.props
    const { isModalOpened } = this.state

    return (
      <>
        <Header
          icon={<IconShare size={16} />}
          title={t('settings.export.accounts.title')}
          desc={t('settings.export.accounts.desc')}
          renderRight={
            <Box horizontal>
              <Button small onClick={this.onMiaouss}>
                {'Miaouss, oui, la guerre !'}
              </Button>
              <Button small onClick={this.onModalOpen} primary>
                {t('settings.export.accounts.button')}
              </Button>
            </Box>
          }
        />
        <Header
          icon={<DownloadCloud size={16} />}
          title={t('settings.export.operations.title')}
          desc={t('settings.export.operations.desc')}
          renderRight={<ExportOperationsBtn primary />}
        />

        {EXPERIMENTAL_WS_EXPORT && (
          <Header
            icon={<IconShare size={16} />}
            title="Experimental websocket local export ⚡"
            desc="Generate a pairing code and use it on Ledger Live Mobile"
            renderRight={<SocketExport />}
          />
        )}
        <ExportAccountsModal isOpen={isModalOpened} onClose={this.onModalClose} />
      </>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(SectionExport)
