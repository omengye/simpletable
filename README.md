# simpletable
简单易用的jQuery表格

[Demo 见此](https://omengye.github.io/simpletable/)

## 支持特性
- [x] 固定表头
- [x] 固定列
- [x] 固定列和表头
- [x] 多级表头
- [x] 单选
- [x] 多选
- [x] 合并行
- [x] 合并列

## 配置列表
```javascript

var option = {
  // 表格样式
  tableClass: 'cgridTable',
  
  // 是否含勾选框
  withCheckBox: true,
  
  // 是否禁止勾选框多选
  disableMutiSel: false,
  
  // 表头
  head: [
            {
                // json数据字段名
                'data-field': 'date',
                
                // 是否显示此列
                'display': true,
                
                // 列名
                'name': '日期',
                
                // 是否固定该列
                'fixed': false,
                
                // 是否合并该列相同内容行
                'mergeRow': false,
                
                // 多级列头
                'children': [
                    {
                        'data-field': 'name',
                        'name': '姓名'
                    }
                ]
            }
        ],
        
    // 是否固定表头
    titleFixed: false,
    
    // 最大合并列单元格个数
    mergecolcellsize: 10,
    
    // 需要合并的行索引(行从1开始)
    mergeinrows: [1,3],
    
    // 最大合并行单元格个数(从第1列到第n列,如果带有checkbox则从第2列开始)
    mergerowcellsize: 2,
    
    // 单击行事件
    onRowClick: function(rownum) {},
    
    // 双击行事件
    onRowDbClick: function(rownum) {},
    
    // 表格加载完毕事件
    finished: function(){}
}

```
