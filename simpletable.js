var cgrid = {
    grids : {},
    instance : function(tableid, options) {
        var gridobj =  {};
        var getVal = function(key, _default) {
            if (options[key] instanceof Function) {
                return options[key];
            }
            if (options[key]) {
                return options[key];
            }
            return _default;
        };
        /**
         * ==================== 自定义行为 起始 ====================
         */
        gridobj.option = {
            // 不带ck框
            withCheckBox: getVal('withCheckBox', false),
            // 带ck框时，禁止多选
            disableMutiSel: getVal('disableMutiSel', false),
            // 是否分页
            hasPage: getVal('hasPage', false),
            // 默认每页条数
            rowNum: getVal('rowNum', false),
            // table head
            head: getVal('head', []),
            // tableClass
            tableClass: getVal('tableClass', ''),
            // 固定表头
            titleFixed: getVal('titleFixed', false),
            // 最大合并列单元格个数
            mergecolcellsize: getVal('mergecolcellsize', 10),
            // 需要合并的行索引(index从1开始)
            mergeinrows: getVal('mergeinrows', []),
            // 最大合并行单元格个数(从第1列到第n列,如果带有checkbox则从第2列开始)
            mergerowcellsize: getVal('mergerowcellsize',2),
            // 数字保留小数位数(-1为不设置保留小数位)
            numfixed: getVal('numfixed',-1),
            colTitle: getVal('colTitle',false),
            // 单击行事件,需要用自定义事件覆盖
            onRowClick: getVal('onRowClick', function(rownum) {}),
            // 双击行事件,需要用自定义事件覆盖
            onRowDbClick: getVal('onRowDbClick', function(rownum) {}),
            // 表格加载完毕
            finished: getVal('finished', function(){}),
            // 点击链接
            onLinkClick: getVal('onLinkClick', function(rownum, colname, e){})
        };
        /**
         * ==================== 自定义行为 结束 ====================
         */
        // 表格数据
        gridobj.data = [];
        // 表格分页所有数据(需要生成表格时传入所有数据)
        gridobj.allPageData = [];
        gridobj.headObj = {
            'data-field': '',
            'name': '',
            'display': true,
            'mergeRow': false,
            'fixed': false,
            'children': []
        };
        // 需要合并的列索引
        gridobj.mergeincols = [];
        // 表格英文列头(不包含隐藏)
        gridobj.titles = [];
        //表格中文列头(不包含隐藏)
        gridobj.titles_zh = [];
        // 固定的列索引
        gridobj.fixedCols = [];
        // 固定的表头
        gridobj.fixedHeads = [];
        // 自定义表格
        gridobj.genTable = function(rows) {
            this.data = rows;
            // 所有表头列名属性
            var colNames = [];
            // 需要隐藏的列
            var hideCols = [];
            // 需要加上链接的列
            var aCols = [];


            var tableStr = "<table style='overflow: hidden;'";
            if (this.option.tableClass) {
                tableStr += " class='"+this.option.tableClass+"'";
            }
            tableStr += ">";


            // 表头行数
            var headnum = [0];
            // 表头行对应内容
            var headMap = {};
            // 表头id的rowspan与colspan
            var headSpan = {};
            // 表头内容对应子内容
            var headChildMap = {};
            // 最后的单级表头
            var relHeads = [];

            var loopHead = function(iterObj, num) {
                if (iterObj.hasOwnProperty('children') && iterObj.children.length > 0) {
                    for (var i in iterObj['children']) {
                        var childObj = iterObj['children'][i];
                        headSpan[childObj['data-field']] = childObj;
                        if (headChildMap.hasOwnProperty(iterObj['data-field'])) {
                            headChildMap[iterObj['data-field']].push(childObj['data-field']);
                        }
                        else {
                            headChildMap[iterObj['data-field']] = [childObj['data-field']];
                        }
                        if (headMap.hasOwnProperty(num+1)) {
                            headMap[num+1].push(childObj['data-field']);
                        }
                        else {
                            headMap[num+1] = [childObj['data-field']];
                        }
                        if (headnum.indexOf(num+1) < 0) {
                            headnum.push(num+1);
                        }
                        loopHead(childObj, num+1);
                    }
                }
                else {
                    // 子节点
                    relHeads.push(iterObj);
                }
            };

            for (var i in gridobj.option.head) {
                var head = gridobj.option.head[i];

                headSpan[head['data-field']] = head;
                if (headMap.hasOwnProperty(0)) {
                    headMap[0].push(head['data-field']);
                }
                else {
                    headMap[0] = [head['data-field']];
                }
                loopHead(head, 0);
            }

            // 总共行数
            var rownum = headnum[headnum.length-1];
            for (var i in headnum) {
                var head = headMap[i];
                for (var j in head) {
                    var it = head[j];
                    if (headChildMap.hasOwnProperty(it)) {
                        var childnums = 0;
                        var hidenum = 0;
                        for (var iter in headChildMap[it]) {
                            var iterObj = headChildMap[it][iter];
                            var loopHide = function(iterKey) {
                                if (headSpan[iterKey].hasOwnProperty('display') && !headSpan[iterKey]['display']) {
                                    ++hidenum;
                                }
                                var childs = headChildMap[iterKey];
                                if (childs && childs.length>0) {
                                    childnums += childs.length;
                                    for (var citer in childs) {
                                        loopHide(childs[citer]);
                                    }
                                }
                                else {
                                    ++childnums;
                                }
                            };
                            loopHide(iterObj);
                        }
                        headSpan[it].colspan = headChildMap[it].length - hidenum;
                        headSpan[it].rowspan = 1;
                    }
                    else {
                        headSpan[it].colspan = 1;
                        headSpan[it].rowspan = rownum -i+1;
                    }
                }
            }

            for (var i in relHeads) {
                var item = relHeads[i];
                // 赋默认值
                for (var k in gridobj.headObj) {
                    if (!item.hasOwnProperty(k)) {
                        item[k] = gridobj.headObj[k];
                    }
                }

                colNames.push(item['data-field']);
                if (!item['display']) {
                    hideCols.push(item['data-field']);
                }
                else {
                    //英文表头
                    this.titles.push(item['data-field']);
                    // 中文表头
                    this.titles_zh.push(item['name']);
                }
                if (item['link']) {
                    aCols.push(item['data-field']);
                }

                if (item['mergeRow']) {
                    var colIdxStart = 1;
                    if (this.option.withCheckBox) {
                        ++colIdxStart;
                    }
                    this.mergeincols.push(parseInt(i)+colIdxStart);
                }

                // 固定表体列
                if (item['fixed']) {
                    var colIdxStart = 1;
                    if (this.option.withCheckBox) {
                        if (this.fixedCols.indexOf(1)<0) {
                            this.fixedCols.push(1);
                        }
                        ++colIdxStart;
                    }
                    this.fixedCols.push(parseInt(i)+colIdxStart);
                }
            }

            // 固定列头
            for (var i in headSpan) {
                var iter = headSpan[i];
                if (iter.hasOwnProperty('fixed') && iter['fixed']) {
                    this.fixedHeads.push(iter['data-field']);
                }
            }

            var headStr = "<thead>";

            for (var i in headnum) {
                headStr += "<tr>";
                if (this.option.withCheckBox && i === "0") {
                    headStr += "<th colspan='1' rowspan='"+rownum+"'><input type='checkbox' onchange='cgrid.grids[\""+tableid+"\"].ckBox()'/></th>";
                }

                var head = headMap[i];
                for (var j in head) {
                    var it = head[j];
                    var iter = headSpan[it];
                    // 构造表头
                    headStr += "<th ";
                    if ((iter.hasOwnProperty('display') && !iter['display'])
                        || (iter.hasOwnProperty('colspan') && iter['colspan']<=0 )) {
                        headStr += " style='display:none;' "
                    }
                    headStr += " colspan='"+iter.colspan+"' rowspan='"+iter.rowspan+"' data-field='"+iter['data-field']+"'>"+iter['name']+"</th>"

                }
                headStr += "</tr>";
            }

            headStr += "</thead>";

            // 按照列名顺序组合一行数据
            var rowsStr = "<tbody>"; // 拼接所有行
            for (var i=0; i<rows.length; ++i) {
                if (this.option.hasPage && i>=this.option.rowNum) {
                    break;
                }

                var row = rows[i];
                var rowStr = "<tr ondblclick='cgrid.grids[\""+tableid+"\"].doubleClickRow("+i+")' data-index='"+i+"' " +
                    "onClick='cgrid.grids[\""+tableid+"\"].oneClickRow("+i+")' data-index='"+i+"'>";// 拼接一行
                // 判断是否带勾选框
                if (this.option.withCheckBox) {
                    rowStr+="<td><input onclick='cgrid.grids[\""+tableid+"\"].ckCheck("+i+")' type='checkbox' class='ckb'></td>";
                }
                for (var j=0; j<colNames.length; ++j) {
                    if (row[colNames[j]] || row[colNames[j]]===0) {

                        // 是否隐藏此列
                        if (hideCols.indexOf(colNames[j])>=0) {
                            rowStr += "<td style='display: none;'";
                        }
                        else {
                            rowStr += "<td style=''";
                        }

                        // 是否增加链接
                        if (aCols.indexOf(colNames[j])>=0) {
                            rowStr += "><a href='#' class='tdLink' td-map='"+i+","+colNames[j]+"'>"+row[colNames[j]]+"</a></td>";
                        }
                        else {
                            var cellVal = row[colNames[j]];
                            // 判断保留小数位
                            if (gridobj.option.numfixed>-1 && !isNaN(parseFloat(cellVal))) {
                                // 去除小数点后的0
                                var tempnum = Math.pow(10,gridobj.option.numfixed);
                                if (this.option.colTitle) {
                                    rowStr += " title='"+cellVal+"'>"+parseFloat(cellVal).toFixed(gridobj.option.numfixed)*tempnum/tempnum+"</td>";
                                }
                                else {
                                    rowStr += " title=''>"+parseFloat(cellVal).toFixed(gridobj.option.numfixed)*tempnum/tempnum+"</td>";
                                }
                            }
                            else {
                                if (this.option.colTitle) {
                                    rowStr += " title='"+cellVal+"'>"+cellVal+"</td>";
                                }
                                else {
                                    rowStr += " title=''>"+cellVal+"</td>";
                                }
                            }
                        }
                    }
                    else {
                        rowStr += "<td style=''></td>";
                    }
                }
                rowStr +="</tr>";
                rowsStr += rowStr;
            }
            rowsStr += "</tbody>";
            // 表格
            tableStr += headStr+rowsStr+"</table>";
            var tableDiv = $("#"+tableid);
            tableDiv.empty().append(tableStr);

            // 点击链接
            var _this = this;
            $('#'+tableid+' .tdLink').click(function(e){
                e.stopPropagation();
                var map = $(e.target).attr('td-map');
                _this.colLinkClick(map.split(',')[0],map.split(',')[1],e);
            });

            // 合并列中的单元格
            if (this.mergeincols && this.mergeincols.length>0) {
                for (var i=0; i<this.mergeincols.length; ++i) {
                    gridobj.rowspan(this.mergeincols[i]);
                }
            }

            // 合并行中的单元格
            if (gridobj.option.mergeinrows && gridobj.option.mergeinrows.length>0) {
                for (var i=0; i<gridobj.option.mergeinrows.length; ++i) {
                    gridobj.colspan(gridobj.option.mergeinrows[i], gridobj.option.mergerowcellsize);
                }
            }

            // 固定列
            if (this.fixedCols && this.fixedCols.length>0 || this.option.titleFixed) {
                // 表格分割线
                $('#'+tableid+' table').css('border-collapse', 'separate');
                // 列头
                if (this.option.titleFixed) {
                    $('#'+tableid+' table th').css('position', 'relative');
                }
                this.scrollEvent();
                for (var i in this.fixedCols) {
                    var c = this.fixedCols[i];
                    this.addTitleRel(c);
                    this.addPositionRel(c);
                }
                for (var i in this.fixedHeads) {
                    var colName = this.fixedHeads[i];
                    var theadObj = $("#"+tableid+" table tr th[data-field='"+colName+"']");
                    theadObj.css('z-index', 2);
                    theadObj.css('position', 'relative');
                }
            }

            this.option.finished();
        };

        // 合并指定列, 其中相同的单元格
        gridobj.rowspan = function (table_colnum) {
            var table_firsttd = "";
            var table_currenttd = "";
            var table_SpanNum = 0;
            var colnum_Obj = $('#'+tableid + " table tbody tr td:nth-child(" + table_colnum + ")");
            //
            var mergesize = 1;
            var _this = this;
            colnum_Obj.each(function (i) {
                if (i === 0) {
                    table_firsttd = $(this);
                    table_SpanNum = 1;
                } else {
                    table_currenttd = $(this);
                    if (table_firsttd.text()!=="" && // 空单元格不合并
                        mergesize < _this.option.mergecolcellsize &&  // 最大合并的列单元格个数
                        table_firsttd.text() === table_currenttd.text()) {
                        table_SpanNum++;
                        table_currenttd.hide(); //remove();
                        table_firsttd.attr("rowSpan", table_SpanNum);
                        ++mergesize;
                    } else {
                        table_firsttd = $(this);
                        table_SpanNum = 1;
                        mergesize=1;
                    }
                }
            });
        };

        // 合并指定行, 其中相同的单元格
        gridobj.colspan = function(table_rownum, table_maxcolnum) {
            if (table_maxcolnum === void 0) {
                table_maxcolnum = 0;
            }
            var table_firsttd = "";
            var table_currenttd = "";
            var table_SpanNum = 0;
            $('#'+tableid + " table tbody tr:nth-child(" + table_rownum + ")").each(function (i) {
                var row_Obj = $(this).children();
                row_Obj.each(function (i) {
                    if (i === 0) {
                        table_firsttd = $(this);
                        table_SpanNum = 1;
                    } else if ((table_maxcolnum > 0) && (i > table_maxcolnum)) {
                        return "";
                    } else {
                        table_currenttd = $(this);
                        if (table_firsttd.text() === table_currenttd.text()) {
                            table_SpanNum++;
                            table_currenttd.hide(); //remove();
                            table_firsttd.attr("colSpan", table_SpanNum);
                        } else {
                            table_firsttd = $(this);
                            table_SpanNum = 1;
                        }
                    }
                });
            });
        };

        //单击延时触发
        gridobj.clickTimeId = null;

        gridobj.doubleClickRow=function(rownum) {
            // 取消上次延时未执行的方法
            clearTimeout(this.clickTimeId);
            this.option.onRowDbClick(rownum);
        };

        gridobj.clickRow=function(rownum) {
            // 取消上次延时未执行的方法
            clearTimeout(this.clickTimeId);
            var _this = this;
            //执行延时
            this.clickTimeId = setTimeout(function() {
                _this.option.onRowClick(rownum);
            }, 200);
        };

        // 获取显示的标题map
        gridobj.getTitleMap = function() {
            var titleMap = {};
            titleMap.titles = this.titles.toString();
            titleMap.titles_zh = this.titles_zh.toString();
            return titleMap;
        };

        gridobj.oneClickRow=function(rownum) {
            if (this.isCkChecked) {
                // 重置
                this.isCkChecked = false;
            }
            else {
                this.clickRow(rownum);
            }
        };

        // 链接点击事件
        gridobj.colLinkClick = function(rownum, colname, t) {
            this.option.onLinkClick(rownum, colname, t);
        };


        // 如果传入所有数据后分页,生成当前页数据(从第一页开始计算)
        gridobj.genPage = function(pagenum) {
            if (this.option.hasPage) {
                // 起始行
                var startRow = (pagenum-1)* this.option.rowNum;
                // 结束行
                var endRow = pagenum* this.option.rowNum;
                if (startRow>this.allPageData.length) {
                    console.log("该页没有数据");
                    return;
                }
                // 抽取该页数据
                var pagedatas = [];
                for (var i=startRow; i<endRow && i<this.allPageData.length; ++i) {
                    pagedatas.push(this.allPageData[i]);
                }
                this.genTable(pagedatas);
            }
        };

        gridobj.ckBox = function() {
            var cked = $('#table table thead input[type="checkbox"]').prop('checked');
            if (!cked) {
                this.uncheckAll();
            }
            else {
                this.checkAll();
            }
        };

        // 勾选表格所有checkbox
        gridobj.checkAll = function() {
            if (this.option.withCheckBox) {
                $('#'+tableid+' table tbody input[type="checkbox"]').prop('checked',true);
            }
        };

        // 勾选表格所有checkbox
        gridobj.uncheckAll = function() {
            if (this.option.withCheckBox) {
                $('#'+tableid+' table tbody input[type="checkbox"]').prop('checked',false);
            }
        };

        // 获取所有点选了checkbox的行数据
        gridobj.getChecked =  function() {
            if (this.data.length <1) {
                return [];
            }
            var list = [];
            var ck = $('#'+tableid+' table tbody input[type="checkbox"]');
            for (var i=0; i<ck.length; ++i) {
                if (ck[i].checked) {
                    list.push(this.data[i]);
                }
            }
            return list;
        };

        //  点击事件是否是checkbox,还是行单击
        gridobj.isCkChecked =false;
        // ck 点击事件
        gridobj.ckCheck= function(rownum) {
            if (!this.option.withCheckBox) {
                return;
            }
            this.isCkChecked = true;
            // 带勾选框时，禁止多选
            if (this.option.disableMutiSel) {
                var ck = $('#'+tableid+' table tbody input[type="checkbox"]');
                for (var i=0; i<ck.length; ++i) {
                    if (rownum!==i && ck[i].checked) {
                        ck[i].checked = false;
                    }
                }
            }
        };

        // 固定列和表头

        gridobj.scrollAction = {x: undefined, y: undefined};
        gridobj.scrollDirection = 0;

        gridobj.addTitleRel = function(num) {
            var thead = $("#"+tableid+" table tr th:nth-child("+num+")");
            thead.css('position', 'relative');
            thead.css('background-color', 'white');
        };

        gridobj.addPositionRel = function(num) {
            var trow = $("#"+tableid+" table tr td:nth-child("+num+")");
            trow.css('position', 'relative');
            trow.css('background-color', 'white');
            trow.css('z-index', 1);
        };

        gridobj.setFixedCol = function(num, x) {
            var trow = $("#"+tableid+" table tr td:nth-child("+num+")");
            trow.css('left', x);
        };

        gridobj.setFixedHead = function(colName, x) {
            var thead = $("#"+tableid+" table tr th[data-field='"+colName+"']");
            thead.css('left', x);
        };

        gridobj.setFixedTitle = function(y) {
            $("#table table th").css('top', y);
        };

        //监听页面滚动事件
        gridobj.scrollEvent = function() {
            var _this = this;
            $('#'+tableid).scroll(function(e){
                _this.scrollFunc();
                if(_this.scrollDirection > 0 && _this.option.titleFixed){
                    _this.setFixedTitle(_this.scrollAction.y)
                }
                else if (_this.scrollDirection < 0) {
                    for (var i in _this.fixedCols) {
                        var item = _this.fixedCols[i];
                        _this.setFixedCol(item, _this.scrollAction.x);
                    }
                    for (var i in _this.fixedHeads) {
                        var item = _this.fixedHeads[i];
                        _this.setFixedHead(item, _this.scrollAction.x);
                    }
                }
            });
        };

        gridobj.scrollFunc = function() {
            var tableDiv = $('#'+tableid);
            if (typeof this.scrollAction.x === undefined) {
                this.scrollAction.x = tableDiv.scrollLeft();
                this.scrollAction.y = tableDiv.scrollTop();
            }
            var diffX = this.scrollAction.x - tableDiv.scrollLeft();
            var diffY = this.scrollAction.y - tableDiv.scrollTop();
            if (diffX < 0) {
                // Scroll right
                this.scrollDirection = -2; //right
            } else if (diffX > 0) {
                // Scroll left
                this.scrollDirection = -1; // left
            } else if (diffY < 0) {
                // Scroll down
                this.scrollDirection = 1; //down
            } else if (diffY > 0) {
                // Scroll up
                this.scrollDirection = 2; //up
            } else {
                this.scrollDirection = 0; // First scroll event
            }
            this.scrollAction.x = tableDiv.scrollLeft();
            this.scrollAction.y = tableDiv.scrollTop();
        };

        cgrid.grids[tableid] = gridobj;
        return gridobj;
    }


};