odoo.define('dynamic_financial_report.bank_book', function(require) {
    'use strict';
    var AbstractAction = require('web.AbstractAction');
    var core = require('web.core');
    var field_utils = require('web.field_utils');
    var rpc = require('web.rpc');
    var session = require('web.session');
    var utils = require('web.utils');
    var QWeb = core.qweb;
    var _t = core._t;

   var BankBook = AbstractAction.extend({
        template: 'BankBook',
        events: {
            'click .bb-line': 'get_move_lines',
            'click .view-move': 'view_move',
            'click #filter_apply_button': 'apply_filter',
            'click #pdf': 'print_pdf',
            'click #xlsx': 'print_xlsx',
        },
        init: function(view, code) {
            this._super(view, code);
            this.wizard = code.context.wizard | null;
            this.session = session;
        },
        start: function() {
            var self = this;
            self.initial_render = true;

                rpc.query({
                model: 'dynamic.bank.book',
                method: 'create',
                args: [{

                }]
                }).then(function(res) {
                    self.wizard = res;
                    self.bank_view(self.initial_render);
                })

        },
            apply_filter: function(event) {

            event.preventDefault();
            var self = this;

            self.initial_render = false;
            var output = {};


            var account_ids = [];
            var account_text = [];


            var account_res = document.getElementById("acc_res")
            var account_list = $(".account").select2('data')
            for (var i = 0; i < account_list.length; i++) {

                if(account_list[i].element[0].selected === true){

                    account_ids.push(parseInt(account_list[i].id))
                    if(account_text.includes(account_list[i].text) === false){
                        account_text.push(account_list[i].text)

                    }


                    account_res.value = account_text
                    account_res.innerHTML=account_res.value;
                }
            }
            if (account_list.length == 0){
               account_res.value = ""
                    account_res.innerHTML="";

            }
            output.account_ids = account_ids


             var journal_ids = [];
            var journal_text = [];
            var journal_res = document.getElementById("journal_res")
            var journal_list = $(".journal").select2('data')
            for (var i = 0; i < journal_list.length; i++) {

                if(journal_list[i].element[0].selected === true){

                    journal_ids.push(parseInt(journal_list[i].id))
                    if(journal_text.includes(journal_list[i].text) === false){
                        journal_text.push(journal_list[i].text)

                    }


                    journal_res.value = journal_text
                    journal_res.innerHTML=journal_res.value;
                }
            }
            if (journal_list.length == 0){
               journal_res.value = ""
                    journal_res.innerHTML="";

            }
            output.journal_ids = journal_ids


            var account_tag_ids = [];
            var account_tag_text = [];
            var account_tag_res = document.getElementById("acc_tag_res")
            var account_tag_list = $(".account-tag").select2('data')
            for (var i = 0; i < account_tag_list.length; i++) {
                if(account_tag_list[i].element[0].selected === true){

                    account_tag_ids.push(parseInt(account_tag_list[i].id))
                    if(account_tag_text.includes(account_tag_list[i].text) === false){
                        account_tag_text.push(account_tag_list[i].text)
                    }

                    account_tag_res.value = account_tag_text
                    account_tag_res.innerHTML=account_tag_res.value;
                }
            }
            if (account_tag_list.length == 0){
               account_tag_res.value = ""
                    account_tag_res.innerHTML="";

            }
            output.account_tag_ids = account_tag_ids



               var analytic_ids = [];
            var analytic_text = [];
            var span_res = document.getElementById("analic_res")
            var analytic_list = $(".analytic").select2('data')
            for (var i = 0; i < analytic_list.length; i++) {
                if(analytic_list[i].element[0].selected === true){

                    analytic_ids.push(parseInt(analytic_list[i].id))
                    if(analytic_text.includes(analytic_list[i].text) === false){
                        analytic_text.push(analytic_list[i].text)
                    }


                    span_res.value = analytic_text
                    span_res.innerHTML=span_res.value;
                }
            }
            if (analytic_list.length == 0){
               span_res.value = ""
                    span_res.innerHTML="";

            }
            output.analytic_ids = analytic_ids


            output.analytic_tag_ids = analytic_tag_ids

            var analytic_tag_ids = [];
            var analytic_tag_text = [];
            var analytic_tag_res = document.getElementById("analic_tag_res")
            var analytic_tag_list = $(".analytic-tag").select2('data')
            for (var i = 0; i < analytic_tag_list.length; i++) {
                if(analytic_tag_list[i].element[0].selected === true){

                    analytic_tag_ids.push(parseInt(analytic_tag_list[i].id))
                    if(analytic_tag_text.includes(analytic_tag_list[i].text) === false){
                        analytic_tag_text.push(analytic_tag_list[i].text)
                    }
                    analytic_tag_res.value = analytic_tag_text
                    analytic_tag_res.innerHTML=analytic_tag_res.value;
                }
            }
            if (analytic_tag_list.length == 0){
               analytic_tag_res.value = ""
                    analytic_tag_res.innerHTML="";

            }
            output.analytic_tag_ids = analytic_tag_ids




            if ($("#date_from").val()) {
                var dateObject = $("#date_from").datepicker("getDate");
                var dateString = $.datepicker.formatDate("yy-mm-dd", dateObject);
                output.date_from = dateString;
            }
            if ($("#date_to").val()) {
                var dateObject = $("#date_to").datepicker("getDate");
                var dateString = $.datepicker.formatDate("yy-mm-dd", dateObject);
                output.date_to = dateString;
            }

            if ($(".entries").length) {
            var post_res = document.getElementById("post_res")
            output.entries = $(".entries")[1].value
            post_res.value = $(".entries")[1].value
                    post_res.innerHTML=post_res.value;
              if ($(".entries")[1].value == "") {
              post_res.innerHTML="all";

              }
            }
            output.include_details = true;



            rpc.query({
                model: 'dynamic.bank.book',
                method: 'write',
                args: [
                    [self.wizard], output
                ],
            }).then(function(res) {
                self.bank_view(self.initial_render);
            });
        },

        print_pdf: function(e) {
            e.preventDefault();
            var self = this;
            var action_title = self._title

            self._rpc({
                model: 'dynamic.bank.book',
                method: 'get_data',
                args: [
                    [self.wizard], action_title
                ],
            }).then(function(data) {
                var action = {
                    'type': 'ir.actions.report',
                    'report_type': 'qweb-pdf',
                    'report_name': 'dynamic_financial_report.bank_book',
                    'report_file': 'dynamic_financial_report.bank_book',
                    'data': {
                        'report_data': data
                    },
                    'context': {
                        'active_model': 'dynamic.bank.book',
                        'landscape': 1,
                        'js_report': true
                    },
                    'display_name': 'Bank Book',
                };
                return self.do_action(action);
            });
        },
        print_xlsx: function() {
            var self = this;
            var action_title = self._title
            self._rpc({
                model: 'dynamic.bank.book',
                method: 'get_data',
                args: [
                    [self.wizard], action_title
                ],
            }).then(function(data) {
                var action = {
                    'type': 'ir_actions_xlsx_download',
                    'data': {
                         'model': 'dynamic.bank.book',
                         'options': JSON.stringify(data[1]),
                         'output_format': 'xlsx',
                         'report_data': JSON.stringify(data[0]),
                         'report_name': 'Bank Book',
                         'dfr_data': 'Bank Book',
                    },
                };
                return self.do_action(action);
            });
        },

        bank_view: function(initial_render = true) {
            var self = this;
            var node = self.$('.container-bb-main');
            var action_title = self._title
            console.log("dhdkfsdf",action_title)
            var last;
            while (last = node.lastChild) node.removeChild(last);
            rpc.query({
                model: 'dynamic.bank.book',
                method: 'get_data',
                args: [
                    [self.wizard], action_title
                ],
            }).then(function(datas) {
                self.filter_data = datas[0]

                self.account_data = datas[1]

                _.each(self.account_data, function(account) {
                    var currency_format = {
                        currency_id: account.company_currency_id,
                        position: account.company_currency_position,
                        symbol: account.company_currency_symbol,
                        noSymbol: true,
                    };
                    if (currency_format.position == "before") {

                         if (account.debit == 0) {
                                account.debit = ' - '
                            } else {
                                account.debit = currency_format.symbol + '&nbsp;' + account.debit.toFixed(2) + '&nbsp;';

                            }
                            if (account.credit == 0) {
                                account.credit = ' - '

                            } else {
                                account.credit = currency_format.symbol + '&nbsp;' + account.credit.toFixed(2) + '&nbsp;';

                            }
                            if (account.balance == 0) {
                                account.balance = ' - '

                            } else {
                                account.balance = currency_format.symbol + '&nbsp;' + account.balance.toFixed(2) + '&nbsp;';

                            }
                    } else {

                        if (account.debit == 0) {
                                account.debit = ' - '
                            } else {
                                account.debit = account.debit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (account.credit == 0) {
                                account.credit = ' - '

                            } else {
                                account.credit = account.credit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (account.balance == 0) {
                                account.balance = ' - '
                            } else {
                                account.balance = account.balance.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                    }
                });
                if (initial_render) {
                    self.$('.bb-filter').html(QWeb.render('FilterSectionBB', {
                        filter_data: datas[0],
                    }));

                    self.$el.find('.journal').select2({
                        placeholder: 'Select Journal...',
                    });
                    self.$el.find('.account').select2({
                        placeholder: 'Select Account...',
                    });
                    self.$el.find('.account-tag').select2({
                        placeholder: 'Select Account Tag...',
                    });
                    self.$el.find('.analytic-tag').select2({
                        placeholder: 'Select Analytic Tag...',
                    });
                    self.$el.find('.analytic').select2({
                        placeholder: 'Select Analytic...',
                    });

                    self.$el.find('#date_from').datepicker({
                        dateFormat: 'dd-mm-yy'
                    });
                    self.$el.find('#date_to').datepicker({
                        dateFormat: 'dd-mm-yy'
                    });
                    self.$el.find('.entries').select2({
                        placeholder: 'Select Moves',
                    });
                }
                self.$('.container-bb-main').html(QWeb.render('BankBookData', {
                    account_data: datas[1]
                }));
            });
        },
        bb_lines_by_page: function(offset, account_id) {
            var self = this;
            return rpc.query({
                model: 'dynamic.bank.book',
                method: 'bb_move_lines',
                args: [self.wizard, offset, account_id],
            })
        },
        get_move_lines: function(event) {
            event.preventDefault();
            var self = this;
            var account_id = $(event.currentTarget).data('account-id');
            var offset = 0;
            var td = $(event.currentTarget).next('tr').find('td');
            if (td.length == 1) {
                self.bb_lines_by_page(offset, account_id).then(function(datas) {
                    _.each(datas[2], function(data) {
                        var currency_format = {
                            currency_id: data.company_currency_id,
                            position: data.company_currency_position,
                            symbol: data.company_currency_symbol,
                            noSymbol: true,
                        };
                        if (currency_format.position == "before") {
                            if (data.debit == 0) {
                                data.debit = ' - '
                            } else {
                                data.debit = currency_format.symbol + '&nbsp;' + data.debit.toFixed(2) + '&nbsp;';

                            }
                            if (data.credit == 0) {
                                data.credit = ' - '

                            } else {
                                data.credit = currency_format.symbol + '&nbsp;' + data.credit.toFixed(2) + '&nbsp;';

                            }
                            if (data.balance == 0) {
                                data.balance = ' - '

                            } else {
                                data.balance = currency_format.symbol + '&nbsp;' + data.balance.toFixed(2) + '&nbsp;';

                            }
                        } else {
                            if (data.debit == 0) {
                                data.debit = ' - '
                            } else {
                                data.debit = data.debit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (data.credit == 0) {
                                data.credit = ' - '

                            } else {
                                data.credit = data.credit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (data.balance == 0) {
                                data.balance = ' - '
                            } else {
                                data.balance = data.balance.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }

                        }


                    });
                    $(event.currentTarget).next('tr').find('td .bb-table-div').remove();
                    $(event.currentTarget).next('tr').find('td ul').after(
                        QWeb.render('SubSectionBB', {
                            count: datas[0],
                            offset: datas[1],
                            account_data: datas[2],
                        }))
                    $(event.currentTarget).next('tr').find('td ul li:first a').css({
                        'background-color': '#00ede8',
                        'font-weight': 'bold',
                    });
                })
            }
        },
        view_move: function(event) {
            event.preventDefault();
            var self = this;
            var context = {};
            var redirect_to_document = function(res_model, res_id, view_id) {
                var action = {
                    type: 'ir.actions.act_window',
                    view_type: 'form',
                    view_mode: 'form',
                    res_model: res_model,
                    views: [
                        [view_id || false, 'form']
                    ],
                    res_id: res_id,
                    target: 'current',
                    context: context,
                };
                return self.do_action(action);
            };
            rpc.query({
                    model: 'account.move',
                    method: 'search_read',
                    domain: [
                        ['id', '=', $(event.currentTarget).data('move-id')]
                    ],
                    fields: ['id'],
                    limit: 1,
                })
                .then(function(record) {
                    if (record.length > 0) {
                        redirect_to_document('account.move', record[0].id);
                    } else {
                        redirect_to_document('account.move', $(event.currentTarget).data('move-id'));
                    }
                });
        },

    });


    var CashBook = AbstractAction.extend({
        template: 'CashBook',
        events: {
            'click .cb-line': 'get_move_lines',
            'click .view-move': 'view_move',
            'click #filter_apply_button': 'apply_filter',
            'click #pdf': 'print_pdf',
            'click #xlsx': 'print_xlsx',
        },
        init: function(view, code) {
            this._super(view, code);
            this.wizard = code.context.wizard | null;
            this.session = session;
        },
        start: function() {
            var self = this;
            self.initial_render = true;
                rpc.query({
                model: 'dynamic.bank.book',
                method: 'create',
                args: [{

                }]
                }).then(function(res) {
                    self.wizard = res;
                    self.cash_view(self.initial_render);
                })

        },
            apply_filter: function(event) {

            event.preventDefault();
            var self = this;

            self.initial_render = false;
            var output = {};


            var account_ids = [];
            var account_text = [];

            var account_res = document.getElementById("acc_res")
            var account_list = $(".account").select2('data')
            for (var i = 0; i < account_list.length; i++) {

                if(account_list[i].element[0].selected === true){

                    account_ids.push(parseInt(account_list[i].id))
                    if(account_text.includes(account_list[i].text) === false){
                        account_text.push(account_list[i].text)

                    }

                    account_res.value = account_text
                    account_res.innerHTML=account_res.value;
                }
            }
            if (account_list.length == 0){
               account_res.value = ""
                    account_res.innerHTML="";

            }
            output.account_ids = account_ids


             var journal_ids = [];
            var journal_text = [];
            var journal_res = document.getElementById("journal_res")
            var journal_list = $(".journal").select2('data')
            for (var i = 0; i < journal_list.length; i++) {


                if(journal_list[i].element[0].selected === true){

                    journal_ids.push(parseInt(journal_list[i].id))
                    if(journal_text.includes(journal_list[i].text) === false){
                        journal_text.push(journal_list[i].text)
                    }

                    journal_res.value = journal_text
                    journal_res.innerHTML=journal_res.value;
                }
            }
            if (journal_list.length == 0){
               journal_res.value = ""
                    journal_res.innerHTML="";

            }
            output.journal_ids = journal_ids


            var account_tag_ids = [];
            var account_tag_text = [];
            var account_tag_res = document.getElementById("acc_tag_res")
            var account_tag_list = $(".account-tag").select2('data')
            for (var i = 0; i < account_tag_list.length; i++) {
                if(account_tag_list[i].element[0].selected === true){

                    account_tag_ids.push(parseInt(account_tag_list[i].id))
                    if(account_tag_text.includes(account_tag_list[i].text) === false){
                        account_tag_text.push(account_tag_list[i].text)
                    }
                    account_tag_res.value = account_tag_text
                    account_tag_res.innerHTML=account_tag_res.value;
                }
            }
            if (account_tag_list.length == 0){
               account_tag_res.value = ""
                    account_tag_res.innerHTML="";

            }
            output.account_tag_ids = account_tag_ids



               var analytic_ids = [];
            var analytic_text = [];
            var span_res = document.getElementById("analic_res")
            var analytic_list = $(".analytic").select2('data')
            for (var i = 0; i < analytic_list.length; i++) {
                if(analytic_list[i].element[0].selected === true){

                    analytic_ids.push(parseInt(analytic_list[i].id))
                    if(analytic_text.includes(analytic_list[i].text) === false){
                        analytic_text.push(analytic_list[i].text)

                    }


                    span_res.value = analytic_text
                    span_res.innerHTML=span_res.value;
                }
            }
            if (analytic_list.length == 0){
               span_res.value = ""
                    span_res.innerHTML="";

            }
            output.analytic_ids = analytic_ids

            output.analytic_tag_ids = analytic_tag_ids

            var analytic_tag_ids = [];
            var analytic_tag_text = [];
            var analytic_tag_res = document.getElementById("analic_tag_res")
            var analytic_tag_list = $(".analytic-tag").select2('data')
            for (var i = 0; i < analytic_tag_list.length; i++) {
                if(analytic_tag_list[i].element[0].selected === true){

                    analytic_tag_ids.push(parseInt(analytic_tag_list[i].id))
                    if(analytic_tag_text.includes(analytic_tag_list[i].text) === false){
                        analytic_tag_text.push(analytic_tag_list[i].text)

                    }


                    analytic_tag_res.value = analytic_tag_text
                    analytic_tag_res.innerHTML=analytic_tag_res.value;
                }
            }
            if (analytic_tag_list.length == 0){
               analytic_tag_res.value = ""
                    analytic_tag_res.innerHTML="";

            }
            output.analytic_tag_ids = analytic_tag_ids




            if ($("#date_from").val()) {
                var dateObject = $("#date_from").datepicker("getDate");
                var dateString = $.datepicker.formatDate("yy-mm-dd", dateObject);
                output.date_from = dateString;
            }
            if ($("#date_to").val()) {
                var dateObject = $("#date_to").datepicker("getDate");
                var dateString = $.datepicker.formatDate("yy-mm-dd", dateObject);
                output.date_to = dateString;
            }

            if ($(".entries").length) {
            var post_res = document.getElementById("post_res")
            output.entries = $(".entries")[1].value
            post_res.value = $(".entries")[1].value
                    post_res.innerHTML=post_res.value;
              if ($(".entries")[1].value == "") {
              post_res.innerHTML="all";

              }
            }

            output.include_details = true;

            rpc.query({
                model: 'dynamic.bank.book',
                method: 'write',
                args: [
                    [self.wizard], output
                ],
            }).then(function(res) {
                self.cash_view(self.initial_render);
            });
        },

        print_pdf: function(e) {
            e.preventDefault();
            var self = this;
            var action_title = self._title
            self._rpc({
                model: 'dynamic.bank.book',
                method: 'get_data',
                args: [
                    [self.wizard], action_title
                ],
            }).then(function(data) {
                var action = {
                    'type': 'ir.actions.report',
                    'report_type': 'qweb-pdf',
                    'report_name': 'dynamic_financial_report.cash_book',
                    'report_file': 'dynamic_financial_report.cash_book',
                    'data': {
                        'report_data': data
                    },
                    'context': {
                        'active_model': 'dynamic.bank.book',
                        'landscape': 1,
                        'js_report': true
                    },
                    'display_name': 'Cash Book',
                };
                return self.do_action(action);
            });
        },
        print_xlsx: function() {
            var self = this;
            var action_title = self._title

            self._rpc({
                model: 'dynamic.bank.book',
                method: 'get_data',
                args: [
                    [self.wizard], action_title
                ],
            }).then(function(data) {
                var action = {
                    'type': 'ir_actions_xlsx_download',
                    'data': {
                         'model': 'dynamic.bank.book',
                         'options': JSON.stringify(data[1]),
                         'output_format': 'xlsx',
                         'report_data': JSON.stringify(data[0]),
                         'report_name': 'Cash Book',
                         'dfr_data': 'Cash Book',
                    },
                };
                return self.do_action(action);
            });
        },

        cash_view: function(initial_render = true) {
            var self = this;
            var action_title = self._title
            console.log("djhhdbkjd", action_title)

            var node = self.$('.container-cb-main');
            var last;
            while (last = node.lastChild) node.removeChild(last);
            rpc.query({
                model: 'dynamic.bank.book',
                method: 'get_data',
                args: [
                    [self.wizard], action_title
                ],
            }).then(function(datas) {
                self.filter_data = datas[0]

                self.account_data = datas[1]

                _.each(self.account_data, function(account) {
                    var currency_format = {
                        currency_id: account.company_currency_id,
                        position: account.company_currency_position,
                        symbol: account.company_currency_symbol,
                        noSymbol: true,
                    };
                    if (currency_format.position == "before") {

                         if (account.debit == 0) {
                                account.debit = ' - '
                            } else {
                                account.debit = currency_format.symbol + '&nbsp;' + account.debit.toFixed(2) + '&nbsp;';

                            }
                            if (account.credit == 0) {
                                account.credit = ' - '

                            } else {
                                account.credit = currency_format.symbol + '&nbsp;' + account.credit.toFixed(2) + '&nbsp;';

                            }
                            if (account.balance == 0) {
                                account.balance = ' - '

                            } else {
                                account.balance = currency_format.symbol + '&nbsp;' + account.balance.toFixed(2) + '&nbsp;';

                            }
                    } else {

                        if (account.debit == 0) {
                                account.debit = ' - '
                            } else {
                                account.debit = account.debit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (account.credit == 0) {
                                account.credit = ' - '

                            } else {
                                account.credit = account.credit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (account.balance == 0) {
                                account.balance = ' - '
                            } else {
                                account.balance = account.balance.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                    }
                });
                if (initial_render) {
                    self.$('.cb-filter').html(QWeb.render('FilterSectionCB', {
                        filter_data: datas[0],
                    }));

                    self.$el.find('.journal').select2({
                        placeholder: 'Select Journal...',
                    });
                    self.$el.find('.account').select2({
                        placeholder: 'Select Account...',
                    });
                    self.$el.find('.account-tag').select2({
                        placeholder: 'Select Account Tag...',
                    });
                    self.$el.find('.analytic-tag').select2({
                        placeholder: 'Select Analytic Tag...',
                    });
                    self.$el.find('.analytic').select2({
                        placeholder: 'Select Analytic...',
                    });

                    self.$el.find('#date_from').datepicker({
                        dateFormat: 'dd-mm-yy'
                    });
                    self.$el.find('#date_to').datepicker({
                        dateFormat: 'dd-mm-yy'
                    });
                    self.$el.find('.entries').select2({
                        placeholder: 'Select Moves',
                    });
                }
                self.$('.container-cb-main').html(QWeb.render('CashBookData', {
                    account_data: datas[1]
                }));
            });
        },
        cb_lines_by_page: function(offset, account_id) {
            var self = this;
            return rpc.query({
                model: 'dynamic.bank.book',
                method: 'bb_move_lines',
                args: [self.wizard, offset, account_id],
            })
        },
        get_move_lines: function(event) {
            event.preventDefault();
            var self = this;
            var account_id = $(event.currentTarget).data('account-id');
            var offset = 0;
            var td = $(event.currentTarget).next('tr').find('td');
            if (td.length == 1) {
                self.cb_lines_by_page(offset, account_id).then(function(datas) {
                    _.each(datas[2], function(data) {
                        var currency_format = {
                            currency_id: data.company_currency_id,
                            position: data.company_currency_position,
                            symbol: data.company_currency_symbol,
                            noSymbol: true,
                        };
                        if (currency_format.position == "before") {
                            if (data.debit == 0) {
                                data.debit = ' - '
                            } else {
                                data.debit = currency_format.symbol + '&nbsp;' + data.debit.toFixed(2) + '&nbsp;';

                            }
                            if (data.credit == 0) {
                                data.credit = ' - '

                            } else {
                                data.credit = currency_format.symbol + '&nbsp;' + data.credit.toFixed(2) + '&nbsp;';

                            }
                            if (data.balance == 0) {
                                data.balance = ' - '

                            } else {
                                data.balance = currency_format.symbol + '&nbsp;' + data.balance.toFixed(2) + '&nbsp;';

                            }
                        } else {
                            if (data.debit == 0) {
                                data.debit = ' - '
                            } else {
                                data.debit = data.debit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (data.credit == 0) {
                                data.credit = ' - '

                            } else {
                                data.credit = data.credit.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }
                            if (data.balance == 0) {
                                data.balance = ' - '
                            } else {
                                data.balance = data.balance.toFixed(2) + '&nbsp;' + currency_id.symbol;

                            }

                        }


                    });
                    $(event.currentTarget).next('tr').find('td .cb-table-div').remove();
                    $(event.currentTarget).next('tr').find('td ul').after(
                        QWeb.render('SubSectionCB', {
                            count: datas[0],
                            offset: datas[1],
                            account_data: datas[2],
                        }))
                    $(event.currentTarget).next('tr').find('td ul li:first a').css({
                        'background-color': '#00ede8',
                        'font-weight': 'bold',
                    });
                })
            }
        },
        view_move: function(event) {
            event.preventDefault();
            var self = this;
            var context = {};
            var redirect_to_document = function(res_model, res_id, view_id) {
                var action = {
                    type: 'ir.actions.act_window',
                    view_type: 'form',
                    view_mode: 'form',
                    res_model: res_model,
                    views: [
                        [view_id || false, 'form']
                    ],
                    res_id: res_id,
                    target: 'current',
                    context: context,
                };
                return self.do_action(action);
            };
            rpc.query({
                    model: 'account.move',
                    method: 'search_read',
                    domain: [
                        ['id', '=', $(event.currentTarget).data('move-id')]
                    ],
                    fields: ['id'],
                    limit: 1,
                })
                .then(function(record) {
                    if (record.length > 0) {
                        redirect_to_document('account.move', record[0].id);
                    } else {
                        redirect_to_document('account.move', $(event.currentTarget).data('move-id'));
                    }
                });
        },

    });

    core.action_registry.add('dynamic.bb', BankBook);
    core.action_registry.add('dynamic.cb', CashBook);

});