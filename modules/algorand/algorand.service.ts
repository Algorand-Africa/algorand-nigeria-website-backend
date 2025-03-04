import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import algosdk, {
  Algodv2,
  generateAccount,
  secretKeyToMnemonic,
} from 'algosdk';

@Injectable()
export class AlgorandService {
  algodClient: Algodv2;
  private readonly logger = new Logger(AlgorandService.name);

  constructor(private readonly configService: ConfigService) {
    const baseServer = this.configService.get('ALGOD_SERVER');
    const token = {
      'X-API-Key': this.configService.get('ALGOD_TOKEN'),
    };
    this.algodClient = new Algodv2(token, baseServer, '');
  }

  generateWallet() {
    const wallet = generateAccount();
    const mnemonic = secretKeyToMnemonic(wallet.sk);
    const address = wallet.addr;
    const privateKey = wallet.sk;

    const payload = {
      address,
      privateKey,
      mnemonic,
    };

    return payload;
  }

  async validateWalletAddress(address: string): Promise<boolean> {
    try {
      await this.algodClient.accountInformation(address).do();
      return true;
    } catch (e) {
      return false;
    }
  }

  async checkLearningPathCertificateNFTMintStatus(
    appId: string,
    ipfsUrl: string,
  ): Promise<{
    status: 'claimed' | 'not minted' | 'not claimed';
    error?: string;
  }> {
    try {
      const appIndex = Number(appId);
      const boxName = Buffer.from(ipfsUrl.replaceAll('ipfs://', ''));
      const boxResponse = await this.algodClient
        .getApplicationBoxByName(appIndex, boxName)
        .do();
      const boxValue = boxResponse.value;
      const decodedBoxValue = algosdk.ABIType.from('(uint64,address)').decode(
        boxValue,
      ) as [bigint, string];

      const [assetId] = decodedBoxValue;
      const appAddress = algosdk.getApplicationAddress(appIndex);

      try {
        const assetInfo = await this.algodClient
          .accountAssetInformation(appAddress, Number(assetId))
          .do();

        const appASABalance = assetInfo['asset-holding'].amount;
        return {
          status: appASABalance > 0 ? 'not claimed' : 'claimed',
        };
      } catch (error) {
        this.logger.error(error);

        return {
          status: 'not minted',
          error: 'Asset not found',
        };
      }
    } catch (error) {
      this.logger.error(error);

      return {
        status: 'not minted',
        error: 'Asset not found',
      };
    }
  }
}
