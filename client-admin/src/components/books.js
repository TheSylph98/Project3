import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, 
        EditButton, TextInput, ReferenceField , ReferenceInput, minValue,
        LongTextInput, DateInput, SelectInput, NumberInput , ArrayField,
        required, number, BooleanInput, Filter} from 'react-admin';

const validateName = [required('Không được bỏ trống!')];
const validateQuantity = [ number(),minValue(0)];

const BookFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Tên sách" source="name" alwaysOn />
        <ReferenceInput label="Thể loại" source="categoryId" reference="Categories" alwaysOn>
            <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput label="Tác giả" source="author" alwaysOn />
    </Filter>
);

export const BookList = (props) => (
    <List title="Quản lý sách" {...props} filters={<BookFilter />} >
        <Datagrid>
            <TextField label="UID sách" source="uid" />
            <TextField label="Tên sách" source="name" />
            <ReferenceField  label="Tác giả" reference="Authors" source="authorId">
                <TextField source="name" />
            </ReferenceField>
            <TextField label="Ảnh" source="imgURL" />
            <TextField label="Số lượng" source="quantity" />
            <TextField label="Giá" source="sellPrice" />
            <TextField label="Đang kinh doanh" source="enable" />
            <EditButton/>
        </Datagrid>
    </List>
);

export const BookEdit = (props) => (
    <Edit title="Thông tin chi tiết" {...props}>
        <SimpleForm>
            <TextInput label="UID sách" source="uid"  />
            <TextInput label="Tên sách" source="name" validate={validateName} />
            {/* <ReferenceInput   label="Thể loại" reference="Categories" source="categoryId">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
            <LongTextInput label="Giới thiệt" source="description" />
            <TextInput label="Ảnh" source="imgURL" />
            {/* <ReferenceInput   label="Nhà xuất bản" reference="Publishers" source="publisherId">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
             <ReferenceInput   label="Tác giả" reference="Authors" source="authorId">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput label="Số lượng"  source="quantity" validate={validateQuantity} />
            <NumberInput  label="Giá" source="sellPrice"  validate={validateQuantity} />
            <DateInput label="Ngày xuất bản" source="publishedAt" />
            <BooleanInput label="Đang kinh doanh" source="enable" />
        </SimpleForm>
    </Edit>
);
export const BookCreate = (props) => (
    <Create title="Thêm sách mới" {...props}>
        <SimpleForm>
            <TextInput label="UID sách" source="uid"  />
            <TextInput label="Tên sách" source="name" validate={validateName} />
            {/* <ReferenceInput   label="Thể loại" reference="Categories" source="categoryId">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
            <TextInput label="Miêu tả" source="description" />
            <TextInput label="Ảnh" source="imgURL" />
            {/* <ReferenceInput   label="Nhà xuất bản" reference="Publishers" source="publisherId">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
             <ReferenceInput   label="Tác giả" reference="Authors" source="authorId">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput label="Số lượng"  source="quantity" validate={validateQuantity} />
            <NumberInput  label="Giá" source="sellPrice" validate={validateQuantity} />
            <DateInput label="Ngày xuất bản" source="publishedAt" />
            <BooleanInput label="Đang kinh doanh" source="enable" />
        </SimpleForm>
    </Create>
);
