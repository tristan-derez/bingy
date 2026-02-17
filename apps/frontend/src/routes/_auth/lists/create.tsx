import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	useNavigate,
	useRouteContext,
} from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ListSearchAddInput } from "@/components/lists/custom-lists/list-search-add";
import { ListRankedItemsContainer } from "@/components/lists/custom-lists/ranked-list/list-ranked-items-container";
import { ListAddedItemMediaCard } from "@/components/lists/custom-lists/unranked-list/list-added-item-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateList } from "@/hooks/useLists";
import { createListDraftItemsAtom } from "@/lib/atoms/draft-list";
import { m } from "@/paraglide/messages";
import { createListSchema } from "@/schemas/create-list-schema";

export const Route = createFileRoute("/_auth/lists/create")({
	component: CreateListPage,
});

type CreateListFormValues = z.infer<typeof createListSchema>;

function CreateListPage() {
	const { session } = useRouteContext({ from: "__root__" });
	const navigate = useNavigate();
	const createList = useCreateList();

	const [selectedItems, setSelectedItems] = useAtom(createListDraftItemsAtom);

	const form = useForm<CreateListFormValues>({
		resolver: zodResolver(createListSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			description: "",
			visibility: "public",
			type: "unranked",
		},
	});

	const listType = form.watch("type");

	const handleRemoveItem = (tmdbId: number, mediaType: string) => {
		setSelectedItems(
			selectedItems.filter(
				(item) => !(item.tmdbId === tmdbId && item.mediaType === mediaType),
			),
		);
	};

	const handleReorder = (reorderedItems: typeof selectedItems) => {
		setSelectedItems(reorderedItems);
	};

	const handleUpdateNote = (
		tmdbId: number,
		mediaType: string,
		note: string,
	) => {
		setSelectedItems(
			selectedItems.map((item) =>
				item.tmdbId === tmdbId && item.mediaType === mediaType
					? { ...item, note }
					: item,
			),
		);
	};

	const onSubmit = (values: CreateListFormValues) => {
		const payload = {
			...values,
			items:
				selectedItems.length > 0
					? selectedItems.map((item, index) => ({
							tmdbId: item.tmdbId,
							mediaType: item.mediaType,
							note: item.note,
							position: values.type === "ranked" ? index + 1 : undefined,
						}))
					: undefined,
		};

		createList.mutate(payload, {
			onSuccess: (data) => {
				setSelectedItems([]);

				const username = session?.user?.name;
				toast.success(
					m.toast_form_create_list_success({ list_name: values.name }),
				);
				navigate({
					to: "/user/$username/lists/$slug",
					params: { username: username, slug: data.slug },
				});
			},
			onError: () => {
				toast.error(m.toast_form_create_list_error({ list_name: values.name }));
			},
		});
	};

	return (
		<div className="container flex flex-col max-w-3xl px-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle>{m.create_list_title()}</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							<div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="w-full lg:w-[55%]">
											<FormLabel>{m.form_create_list_name_label()}</FormLabel>
											<FormControl>
												<Input {...field} autoComplete="off" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="visibility"
									render={({ field }) => {
										const visibilityLabel = {
											public: m.form_create_list_visibility_item_public_short(),
											limited:
												m.form_create_list_visibility_item_limited_short(),
											private:
												m.form_create_list_visibility_item_private_short(),
										}[field.value as "public" | "limited" | "private"];

										return (
											<FormItem className="w-full lg:w-[45%]">
												<FormLabel>
													{m.form_create_list_visibility_label()}
												</FormLabel>
												<FormControl>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger className="w-full">
															<SelectValue>{visibilityLabel}</SelectValue>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="public">
																{m.form_create_list_visibility_item_public()}
															</SelectItem>
															<SelectItem value="limited">
																{m.form_create_list_visibility_item_limited()}
															</SelectItem>
															<SelectItem value="private">
																{m.form_create_list_visibility_item_private()}
															</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							</div>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="flex flex-col justify-center">
										<div className="flex gap-2">
											<FormControl>
												<Checkbox
													checked={field.value === "ranked"}
													onCheckedChange={(checked) =>
														field.onChange(checked ? "ranked" : "unranked")
													}
												/>
											</FormControl>
											<FormLabel>{m.form_create_list_type_ranked()}</FormLabel>
										</div>
										<FormDescription>
											{m.form_create_list_type_ranked_description()}
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{m.form_create_list_description_label()}
										</FormLabel>
										<FormControl>
											<Textarea
												className="resize-y field-sizing-content"
												rows={4}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-2">
									<FormLabel>{m.form_create_list_add_items_label()}</FormLabel>
									<ListSearchAddInput />
								</div>
							</div>
							<div className="flex w-full gap-2">
								<Button
									type="button"
									variant="destructive"
									onClick={() => navigate({ to: "/" })}
									className="flex-1"
								>
									{m.form_create_list_btn_cancel()}
								</Button>
								<Button
									type="submit"
									disabled={createList.isPending}
									className="flex-1"
								>
									{createList.isPending
										? m.form_create_list_btn_creating()
										: m.form_create_list_btn_create()}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{selectedItems.length > 0 ? (
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<h3 className="text-sm font-medium">
							{m.list_added_items({
								count: selectedItems.length,
								total_items: selectedItems.length,
							})}
						</h3>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setSelectedItems([])}
						>
							{m.list_added_items_clear_all()}
						</Button>
					</div>
					{listType === "ranked" ? (
						<ListRankedItemsContainer
							items={selectedItems}
							onRemove={handleRemoveItem}
							onUpdateNote={handleUpdateNote}
							onReorder={handleReorder}
						/>
					) : (
						<div className="grid grid-cols-1 gap-2">
							{selectedItems.toReversed().map((item) => {
								return (
									<ListAddedItemMediaCard
										key={`${item.tmdbId}-${item.mediaType}`}
										tmdbId={item.tmdbId}
										mediaType={item.mediaType}
										posterPath={item.posterPath}
										title={item.title}
										releaseDate={item.releaseDate}
										note={item.note}
										onRemove={handleRemoveItem}
										onUpdateNote={handleUpdateNote}
									/>
								);
							})}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}
