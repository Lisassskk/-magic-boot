{
  "properties" : { },
  "id" : "a7035a4c4ce74902b8f8f07ae45f335c",
  "script" : null,
  "groupId" : "cbe08d51e1af46d085be077eda555766",
  "name" : "详情",
  "createTime" : 1658317155469,
  "updateTime" : null,
  "lock" : null,
  "createBy" : null,
  "updateBy" : null,
  "path" : "/get",
  "method" : "GET",
  "parameters" : [ ],
  "options" : [ {
    "name" : "permission",
    "value" : "data:testdemo:view",
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
return db.selectOne("""
    select id,desc_ribe,dict_type,type,remarks from sys_dict where id = #{id}
""")