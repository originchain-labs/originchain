"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { SiweMessage } from "siwe";
import { getNonce, verifySignature } from "@/lib/api-client";
import { saveSession, getSession, clearSession } from "@/lib/session";

export function useAuth() {
    const { address, isConnected, chainId } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Synchronous re-entrancy guard: `isSigningIn` state only reflects in the
    // DOM after a render commits, which isn't reliable enough on its own to
    // block a second signIn() call that fires before that commit happens.
    const isSigningInRef = useRef(false);

    // On mount / address change, check if we already have a valid session
    // for the currently connected address.
    useEffect(() => {
        const session = getSession();
        if (session && address && session.walletAddress.toLowerCase() === address.toLowerCase()) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [address]);

    const signIn = useCallback(async () => {
        if (!address || isSigningInRef.current) return;
        isSigningInRef.current = true;
        setIsSigningIn(true);
        setError(null);

        try {
            const nonce = await getNonce(address);

            const siweMessage = new SiweMessage({
                domain: window.location.host,
                address,
                statement: "Sign in to OriginChain",
                uri: window.location.origin,
                version: "1",
                chainId: chainId ?? arbitrumSepolia.id,
                nonce,
                issuedAt: new Date().toISOString(),
            });

            const message = siweMessage.prepareMessage();
            const signature = await signMessageAsync({ message });

            const { token, creator } = await verifySignature(message, signature);
            saveSession(token, address, creator.id);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign-in failed");
            setIsAuthenticated(false);
        } finally {
            isSigningInRef.current = false;
            setIsSigningIn(false);
        }
    }, [address, chainId, signMessageAsync]);

    const signOut = useCallback(() => {
        clearSession();
        setIsAuthenticated(false);
        disconnect();
    }, [disconnect]);

    return { isConnected, isAuthenticated, isSigningIn, error, signIn, signOut };
}