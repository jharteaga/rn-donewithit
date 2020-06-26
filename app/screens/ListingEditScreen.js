import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';

import AppFormPicker from '../components/forms/AppFormPicker';
import CategoryPickerItem from '../components/CategoryPickerItem';
import FormImagePicker from '../components/forms/FormImagePicker';
import listingsApi from '../api/listings';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import { useLocation } from '../hooks/useLocation';
import Screen from '../components/Screen';
import UploadScreen from './UploadScreen';

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label('Title'),
  price: Yup.number().required().min(1).max(10000).label('Price'),
  description: Yup.string().label('Description'),
  category: Yup.object().required().nullable().label('Category'),
  images: Yup.array().min(1, 'Please, select at least one image'),
});

const categories = [
  {
    label: 'Furniture',
    value: 1,
    backgroundColor: '#fc5c65',
    icon: 'floor-lamp',
  },
  {
    label: 'Cars',
    value: 2,
    backgroundColor: '#fd9644',
    icon: 'car',
  },
  {
    label: 'Cameras',
    value: 3,
    backgroundColor: '#fed330',
    icon: 'camera',
  },
  {
    label: 'Games',
    value: 4,
    backgroundColor: '#26de81',
    icon: 'cards',
  },
  {
    label: 'Clothing',
    value: 5,
    backgroundColor: '#2bcbba',
    icon: 'shoe-heel',
  },
  {
    label: 'Sports',
    value: 6,
    backgroundColor: '#45aaf2',
    icon: 'basketball',
  },
  {
    label: 'Movies & Music',
    value: 7,
    backgroundColor: '#4b7bec',
    icon: 'headphones',
  },
  {
    label: 'Books',
    value: 8,
    backgroundColor: 'purple',
    icon: 'book',
  },
];

function ListingEditScreen(props) {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location },
      (progress) => setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return alert('Could not save the listing.');
    }

    resetForm();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <AppForm
        initialValues={{
          title: '',
          price: '',
          category: null,
          description: '',
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <AppFormField maxLength={255} name="title" placeholder="Title" />
        <AppFormField
          keyboardType="number-pad"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
        />
        <AppFormPicker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <AppFormField
          maxLenght={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="post" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});

export default ListingEditScreen;
