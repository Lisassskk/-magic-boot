{
  "properties" : { },
  "id" : "42c3ecb7b28b4179a562140e3722f89a",
  "script" : null,
  "groupId" : "3442f636245e44a997d3af4db8a33ee9",
  "name" : "列表",
  "createTime" : 1658317155501,
  "updateTime" : null,
  "lock" : null,
  "createBy" : null,
  "updateBy" : null,
  "path" : "/list",
  "description" : null
}
================================
<template>
    <mb-list ref="magicList" v-bind="listOptions" />
    <mb-dialog ref="formDialog" :title="magicFormTitle" @confirm-click="magicForm.save($event)" width="50%">
        <template #content>
            <mb-form ref="magicForm" @reload="magicList.reload" v-bind="formOptions" />
        </template>
    </mb-dialog>
</template>
<script setup>
    import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
    const { proxy } = getCurrentInstance()
    const formDialog = ref()
    const magicList = ref()
    const magicForm = ref()
    const magicFormTitle = ref()
    const listOptions = reactive({
        tools: [{
            type: 'add',
            permission: 'data:testdemo:save',
            click: () => {
                magicFormTitle.value = '添加'
                formDialog.value.show()
            }
        }],
        table: {
            url: '/data/testdemo/list',
            where: {
                descRibe: {
                    label: '描述',
                    component: 'input',
                    props: {
                        type: 'textarea'
                    }
      
                },
                dictType: {
                    label: '字典类型',
                    component: 'select',
                    props: {
                        type: 'dict_type'
                    }
                },
                type: {
                    label: '类型',
                    component: 'input'
                },
                remarks: {
                    label: '备注',
                    component: 'input'
                }
            },
            cols: [
                {
                    field: 'descRibe',
                    label: '描述'
                },
                {
                    field: 'dictType',
                    label: '字典类型',
                    dictType: 'dict_type'
                },
                {
                    field: 'type',
                    label: '类型'
                },
                {
                    field: 'remarks',
                    label: '备注'
                },{
                    label: '操作',
                    type: 'btns',
                    width: 140,
                    fixed: 'right',
                    btns: [
                        {
                            permission: 'data:testdemo:save',
                            label: '修改',
                            type: 'text',
                            icon: 'ElEdit',
                            click: (row) => {
                                magicFormTitle.value = '修改'
                                formDialog.value.show();
                                proxy.$nextTick(() => magicForm.value.getDetail(row.id))
                            }
                        }, {
                            permission: 'data:testdemo:delete',
                            label: '删除',
                            type: 'text',
                            icon: 'ElDelete',
                            click: (row) => {
                                proxy.$common.handleDelete({
                                    url: '/data/testdemo/delete',
                                    id: row.id,
                                    done: () => magicList.value.reload()
                                })
                            }
                        }
                    ]
                }
            ]
        }
    })
    
    const formOptions = reactive({
        detail: {
            request: {
              url: '/data/testdemo/get'
            }
        },
        form: {
            request: {
                url: "/data/testdemo/save"
            },
            rows: [{
                gutter: 24,
                cols: [{
                    span: 12,
                    name: 'descRibe',
                    label: '描述',
                    component: 'input',
                    props: {
                        type: 'textarea'
                    }
      
                },{
                    span: 12,
                    name: 'dictType',
                    label: '字典类型',
                    component: 'select',
                    props: {
                        type: 'dict_type'
                    }
                },{
                    span: 12,
                    name: 'type',
                    label: '类型',
                    component: 'input',
                    rules: [{ required: true, message: '请输入类型', trigger: 'blur' }]
                },{
                    span: 12,
                    name: 'remarks',
                    label: '备注',
                    component: 'input'
                }]
            }]
        }
    })
</script>