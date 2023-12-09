const express = require('express');
const notify = require('./firebase/notify');
const firebase = require('./firebase/config');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = firebase.firestore();
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.get('/getStores', async (req, res) => {
    try {
        const storesRef = db.collection('Store');
        const snapshot = await storesRef.get();
        const stores = snapshot.docs.map(doc => doc.data());
        res.json(stores);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.post('/notifyStore', async (req, res) => {
    try {
        const storeId = req.body.storeId;
        const text = req.body.text;

        // Get store document
        const storeRef = db.collection('Store').doc(storeId);
        const storeDoc = await storeRef.get();
        const storeData = storeDoc.data();

        // Check if store exists  
        const ownerId = storeData.OwnerId;

        // Get shop owner document
        const ownerRef = db.collection('ShopOwners').doc(ownerId);
        const ownerDoc = await ownerRef.get();
        const ownerData = ownerDoc.data();
        // Get device token
        const deviceToken = ownerData.deviceToken;
        notify(deviceToken, "Alert", text, false);
        res.json({ deviceToken });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/notifyAllStores', async (req, res) => {
    try {
        const text = req.body.text;

        // Get all store documents
        const storesRef = db.collection('Store');
        const snapshot = await storesRef.get();
        const stores = snapshot.docs.map(doc => doc.data());

        // Notify all store owners
        const notifications = [];

        for (const store of stores) {
            const ownerId = store.OwnerId;
            const ownerRef = db.collection('ShopOwners').doc(ownerId);
            const ownerDoc = await ownerRef.get();
            const ownerData = ownerDoc.data();

            if (ownerData && ownerData.deviceToken) {
                const deviceToken = ownerData.deviceToken;
                notify(deviceToken, "Alert", text, false);
                notifications.push({ ownerId, deviceToken });
            }
        }

        res.json({ notifications });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.post('/verifyStore', async (req, res) => {
    try {
        const storeId = req.body.storeId;

        // Get store document
        const storeRef = db.collection('Store').doc(storeId);
        await storeRef.update({ verified: true });
        const storeDoc = await storeRef.get();
        const storeData = storeDoc.data();

        const ownerRef = db.collection('ShopOwners').doc(storeData.OwnerId);
        const ownerDoc = await ownerRef.get();
        const token = ownerDoc.deviceToken;
        notify(token, "Alert", "Yoar Store has been verified Successfully!", false);
        res.json({ message: 'Store verified successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/app1', async (req, res) => {
    try {
        const enabled = req.body.enabled;

        // Get store document
        const metaref = db.collection('Meta').doc('Meta');
        await metaref.update({ maintainance_user: enabled });
        res.json({ message: 'Sucess' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/app2', async (req, res) => {
    try {
        const enabled = req.body.enabled;

        // Get store document
        const metaref = db.collection('Meta').doc('Meta');
        await metaref.update({ maintainance_shop: enabled });
        res.json({ message: 'Sucess' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/app_desc', async (req, res) => {
    try {
        const desc = req.body.desc;
        // Get store document
        const metaref = db.collection('Meta').doc('Meta');
        await metaref.update({ desc: desc });
        res.json({ message: 'Sucess' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/app_desc_get', async (req, res) => {
    try {
        // Get store document
        const metaref = db.collection('Meta').doc('Meta');
        const desc = await metaref.get();
        res.json({ desc: desc.desc });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/app1_get', async (req, res) => {
    try {
        // Get store document
        const metaref = db.collection('Meta').doc('Meta');
        const desc = await metaref.get();
        res.json({ enabled: desc.maintainance_user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/app2_get', async (req, res) => {
    try {
        // Get store document
        const metaref = db.collection('Meta').doc('Meta');
        const desc = await metaref.get();
        res.json({ enabled: desc.maintainance_shop });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.listen(4001, () => {
    console.log('Server is listening on port 4001');
});
