{
  "properties" : { },
  "id" : "d86090c82e7748cab5f5e91f0c2978a6",
  "script" : null,
  "groupId" : "cbe08d51e1af46d085be077eda555766",
  "name" : "删除",
  "createTime" : 1658317155411,
  "updateTime" : null,
  "lock" : null,
  "createBy" : null,
  "updateBy" : null,
  "path" : "/delete",
  "method" : "DELETE",
  "parameters" : [ ],
  "options" : [ {
    "name" : "permission",
    "value" : "data:testdemo:delete",
    "description" : "允许拥有该权限的访问",
    "required" : false,
    "dataType" : "String",
    "type" : null,
    "defaultValue" : null,
    "validateType" : null,
    "error" : null,
    "expression" : null,
    "children" : null
  } ],
  "requestBody" : null,
  "headers" : [ ],
  "paths" : [ ],
  "responseBody" : null,
  "description" : null,
  "requestBodyDefinition" : null,
  "responseBodyDefinition" : null
}
================================
return db.table('sys_dict').logic().where().eq('id', id).delete()