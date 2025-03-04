import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

export default function CuentoPDF({ route }) {
    const { cuentoTitle, cuentoPath } = route.params;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: cuentoPath }}
                style={{ flex: 1 }}
                onError={(error) => console.error('WebView error: ', error)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});